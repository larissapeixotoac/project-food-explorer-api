import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
const knex = require('../database/knex')

interface PaymentRequest extends Request {
    admin: {
        id: number,
        isAdmin: number
    }
}

class PaymentController {
    async update(request: PaymentRequest, response: Response) {
        const { id, status } = request.body
        const order_id = Number(id)        

        const order = await knex('orders').where({ id: order_id }).first()       

        if(order.status === 'open') {
            return response.status(StatusCodes.BAD_REQUEST).json('Esse pedido ainda está aberto.')
        }

        if(order.status === 'delivered') {
            return response.status(StatusCodes.BAD_REQUEST).json('Esse pedido já foi finalizado.')
        }

        if((order.status === 'preparing' && status === 'canceled') || (order.status === 'pending' && status === 'canceled')) {
            await knex('payment').where({ user_id: order.user_id }).where({ order_id })
            .update({
                status: 'canceled'
            })
            .update('updated_at', knex.fn.now())  

            await knex('orders').where({ id: order_id })
                .update({
                    status: 'canceled'
                })
                .update('updated_at', knex.fn.now())  

            return response.status(StatusCodes.BAD_REQUEST).json('Problema no pagamento, pedido cancelado.')
        }

        if(status === 'preparing') {
            await knex('payment').where({ user_id: order.user_id }).where({ order_id })
            .update({
                status: 'paid'
            })
            .update('updated_at', knex.fn.now()) 

            await knex('orders').where({ id: order_id })           
            .update({
                status,
            })
            .update('updated_at', knex.fn.now())

            return response.status(StatusCodes.OK).json("Pagamento confirmado.")
        }
    }
}

module.exports = PaymentController