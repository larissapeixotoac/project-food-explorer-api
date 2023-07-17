import { Request, Response } from 'express'
import { hash } from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
const knex = require('../database/knex')

import { createUserSchema } from './UsersControllers'

class AdminsControllers {
    async create(request: Request, response: Response): Promise<Response> {
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

        if(pssLenght < 6) {
            return response.status(StatusCodes.BAD_REQUEST).json('A senha precisa ter pelo menos 6 caracteres.')
        }
        
        const hashedPasword = await hash(password, 8)       

        const [id] = await knex('admins').insert({
            name,
            email,
            password: hashedPasword
        })

        return response.json('Administrador cadastrado com sucesso.')
    }
}

export { AdminsControllers }