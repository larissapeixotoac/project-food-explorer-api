import { Request, Response } from 'express'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
const knex = require('../database/knex')

 export const createUserSchema = z.object({
    name: z.string()
        .nonempty("O nome é obrigatório"),
    email: z.string()
        .nonempty("O e-mail é obrigatório")
        .includes('@', { message: 'E-mail inválido.'}),
    password: z.string()
        .nonempty("A senha é obrigatória")
        .min(6, "A senhá precisa ter pelo menos 6 caracteres.")
})

class UsersControllers {
    async create(request: Request, response: Response) {
        const { name, email, password } = request.body

        const resultValidation = createUserSchema.safeParse({
            name,
            email,
            password
        })
        
        if(resultValidation.success === false) {
            const { name, email, password } = resultValidation.error.format()
            if(name) {
                return response.status(StatusCodes.BAD_REQUEST).json(name?._errors[0])
            }
            if(email) {
                return response.status(StatusCodes.BAD_REQUEST).json(email?._errors[0])
            }
            if(password) {
                return response.status(StatusCodes.BAD_REQUEST).json(password?._errors[0])
            }
            
            return response.status(StatusCodes.BAD_REQUEST).json()
        }

        const pssLenght = String(password).length
        

        const checkIfUserExist = await knex('users').where({ email }).first()      
        const checkIfADminExist = await knex('admins').where({ email }).first()
        
        if(checkIfUserExist) {
            return response.status(StatusCodes.BAD_REQUEST).json('E-mail já cadastrado.')
        }
        if(checkIfADminExist) {
            return response.status(StatusCodes.BAD_REQUEST).json('E-mail já cadastrado.')  
        }
                    
        const hashedPasword = await hash(password, 8)       

        const [id] = await knex('users').insert({
            name,
            email,
            password: hashedPasword
        })

        await knex('orders').insert({
            status: 'open',
            payment_id: null,
            user_id: id
        })

        return response.status(StatusCodes.CREATED).json("Usuário cadastrado com sucesso.")
    }
}

export { UsersControllers }