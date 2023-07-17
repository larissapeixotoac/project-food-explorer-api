const { verify } = require('jsonwebtoken')
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

const authConfig = require('../configs/auth')

interface AuthenticatedRequest extends Request {
    admin?: {
        id: number,
        isAdmin: number
    }
}

function ensureAuthenticared(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization
    
    if(!authHeader) {
        return response.status(StatusCodes.BAD_REQUEST).json('JWT Token não informado.')
    }
    const [, token] = authHeader.split(' ')
    
    try {
        const { sub: admin_id, jti: isAdmin } = verify(token, authConfig.jwt.secret)
        
        request.admin = {
            id: Number(admin_id),
            isAdmin: Number(isAdmin)
        }

        return next()
    } catch {
        return response.status(StatusCodes.FORBIDDEN).json("JWT Token inválido.")
    }
}

module.exports = ensureAuthenticared