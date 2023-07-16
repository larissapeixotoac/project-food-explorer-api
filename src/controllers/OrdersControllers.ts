import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
const knex = require('../database/knex')

interface RestaurantRequest extends Request {
    admin: {
        id: number,
        isAdmin: number
    }
}

interface IOrder {
    id: number,
    status: string,
    payment_id: number|null,
    user_id: number,
    created_at: string,
    updated_at: string
}

interface IItems {
    id: number,
    dish_id: number,
    quantity: number,
    price: number,
    order_id: number,
    created_at: string,
    updated_at: string
}

class OrdersControllers {    
    async finalizeOrder(request: RestaurantRequest, response: Response) {
        const user_id = request.admin.id

        const openOrder = await knex("orders").where({ user_id }).where({ status: 'open' }).first()
        
        const [payment_id] = await knex('payment').insert({
            status: 'pending',
            user_id,
            order_id: openOrder.id
        })

        await knex("orders").where({ id: openOrder.id})
            .update({
                status: 'pending',
                payment_id
            })
            .update('updated_at', knex.fn.now())

        await knex('orders').insert({
            status: 'open',
            payment_id: null,
            user_id
        })

        return response.status(StatusCodes.OK).json('Pedido feito, aguardando confirmação do pagamento.')
    }

    async updateStatus(request: RestaurantRequest, response: Response) {
        const { id } = request.params

        const order = await knex('orders').where({ id }).first()

        if(order.status === 'delivered') {
            return response.status(StatusCodes.BAD_REQUEST).json('Esse pedido já foi finalizado.')            
        }

        if(order.status === 'preparing') {
            await knex('orders').where({ id })
                .update({
                    status: 'delivered'
                })
                .update('updated_at', knex.fn.now())
        } else {
            return response.status(StatusCodes.BAD_REQUEST).json('O pagamento ainda não foi confirmado.')        
        }

        return response.status(StatusCodes.OK).json('O estatos do pedido foi alterado.')

    }

    async showOrders(request: RestaurantRequest, response: Response) {
        const user_id = request.admin.id

        let orders = await knex('orders').where({ user_id })
        
        if(request.admin.isAdmin === 1) {
            orders = await knex('orders')     
        }

        const items = await knex('order-items')

        const ordersWithItems = orders.map((order: IOrder) => {
            const dishes = items.filter((item: IItems) => item.order_id === order.id)               
                        
            return {
                ...order,
                dishes
            }
        }) 
        
        return response.status(StatusCodes.OK).json(ordersWithItems)
    }
    
    async index(request: RestaurantRequest, response: Response){
        const { id } = request.params
        const user_id = request.admin.id

        let checkOrder = await knex('orders').where({ user_id }).where({ id }).first()

        if(request.admin.isAdmin) {
            checkOrder = await knex('orders').where({ id }).first()
        }
        
        if(!checkOrder) {
            return response.status(StatusCodes.BAD_REQUEST).json('A ordem não existe')
        }

        const items = await knex('order-items')
        
        const dishes = items.filter((item: IItems) => item.order_id === checkOrder.id)               
        const orderWithItems = {
            ...checkOrder,
            dishes
        }
        
        return response.status(StatusCodes.OK).json(orderWithItems)
    }
}

module.exports = OrdersControllers