import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
const knex = require('../database/knex')

interface RestaurantRequest extends Request {
    admin: {
        id: number,
        isAdmin: number
    }
}

class OrderItemsController {
    async addItem(request: RestaurantRequest, response: Response) {
        const { dish_id, quantity  } = request.body
        const user_id = request.admin.id
        const isAdmin = request.admin.isAdmin
        
        if(isAdmin === 1) {
            return response.status(StatusCodes.BAD_REQUEST).json("Administradores não podem fazer pedidos.")
        }
        
        const dish = await knex('restaurant').where({ id: dish_id }).first()

        if(!dish) {
            return response.status(StatusCodes.BAD_REQUEST).json("Prato não encontrado.")
        }

        const openOrder = await knex('orders').where({ user_id }).where({ status: 'open'}).first()
        
        const checkDishOnOrder = await knex('order-items').where({ order_id: openOrder.id }).where({ dish_id }).first()

        if(checkDishOnOrder) {
            await knex('order-items')
                .where({  order_id: openOrder.id })
                .where({ dish_id })
                .update({
                    quantity,
                    price: dish.price
                })
                .update('updated_at', knex.fn.now())
        } else {
            await knex('order-items').insert({
                dish_id,
                quantity,
                price: dish.price,
                order_id: openOrder.id
            })
        }       

        await knex('orders').where({ id: openOrder.id }).update('updated_at', knex.fn.now())

        return response.status(StatusCodes.CREATED).json('Item adicionado.')
    }

    async delete(request: RestaurantRequest, response: Response) {
        const { dish_id } = request.query
        const user_id  = request.admin?.id
        const isAdmin = request.admin.isAdmin 
        
        if(isAdmin === 1) {
            return response.status(StatusCodes.BAD_REQUEST).json("Administradores não deletar itens dos usuários.")
        }

        const openOrder = await knex('orders').where({ user_id }).where({ status: 'open'}).first()

        await knex('order-items')
        .where({ order_id: openOrder.id })
        .where({ dish_id })
        .delete()

        await knex('orders').where({ id: openOrder.id }).update('updated_at', knex.fn.now())
        
        return response.status(StatusCodes.OK).json("Item excluído do pedido.")
    }

    async showItems(request: RestaurantRequest, response: Response) {
        const user_id = request.admin.id

        const openOrder = await knex('orders').where({ user_id }).where({ status: 'open'}).first()
        const checkDishOnOrder = await knex('order-items').where({ order_id: openOrder.id })
        
        return response.status(StatusCodes.OK).json(checkDishOnOrder)
    }  
}

module.exports = OrderItemsController