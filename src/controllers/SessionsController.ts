import { compare } from 'bcryptjs'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
const { sign } = require('jsonwebtoken')

const knex = require('../database/knex')
const authConfig = require('../configs/auth')

class SessionsController {
    async create(request: Request, response: Response) {
        const { email, password } = request.body

        const user = await knex('users').where({ email }).first()
        const admin = await knex('admins').where({ email }).first()

        if(!user && !admin) {
            return response.status(StatusCodes.BAD_REQUEST).json('E-mail e/ou senha incorretos.')
        }
        
        if(user) {
            const checkPassword = await compare(password, user.password)
            
            if(!checkPassword) {
                return response.status(StatusCodes.BAD_REQUEST).json('E-mail e/ou senha incorretos.')
            }
        }
        if(admin) {
            const checkPassword = await compare(password, admin.password)
            
            if(!checkPassword) {
                return response.status(StatusCodes.BAD_REQUEST).json('E-mail e/ou senha incorretos.')
            }
        }
        
        const { secret, expiresIn } = authConfig.jwt
        let token

        if(user) {
            token = sign({}, secret, {
                subject: String(user.id),
                expiresIn,
                jwtid: '0'
            })
        }
        if(admin) {
            token = sign({}, secret, {
                subject: String(admin.id),
                expiresIn,
                jwtid: '1'
            })
        }

        if(user) {
            return response.json({ user, token })
        }
        if(admin) {
            return response.json({ admin, token })
        }
    }
}

export { SessionsController }