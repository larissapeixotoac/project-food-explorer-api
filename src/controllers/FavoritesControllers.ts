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

class FavoritesControllers {
    async addDish(request: RestaurantRequest, response: Response) {
        const { dish_id, user_id } = request.body
        const isAdmin = z.coerce.boolean().parse(request.admin.isAdmin)
        
        const dish = await knex("restaurant").where({ id: dish_id}).first()        
        if(!dish) {
            return response.status(StatusCodes.BAD_REQUEST).json('Esse prato não existe.')
        }

        const checkIfUserExist = await knex('users').where({ id: user_id }).first()
        const checkIfAdminExist = await knex('admins').where({ id: user_id }).first()
                
        if(!checkIfUserExist && !checkIfAdminExist) {
            return response.status(StatusCodes.BAD_REQUEST).json('Esse usuário não existe.')
        }

        const newFavorite = {
            dish_id: dish.id,
            user_id: checkIfUserExist.id,
            isAdmin: isAdmin ? 1 : 0
        }

        await knex('favorites').insert(newFavorite)

        return response.status(StatusCodes.OK).json("Favoritado!")
    }

    async removeFavorites(request: Request, response: Response) {
        const { dish_id } = request.params

        await knex('favorites').where({ dish_id }).delete()

        return response.status(StatusCodes.OK).json("Desfavoritado.")
    }

    async show(request: RestaurantRequest, response: Response) {
        const { dish_id }  = request.params
        const user_id = request.admin.id
        const isAdmin = z.coerce.boolean().parse(request.admin.isAdmin)

        let favorite = await knex('favorites').where({ user_id }).where({ isAdmin }).where({ dish_id }).first()
        
        if(isAdmin){
            favorite = await knex('favorites').where({ isAdmin }).where({ dish_id }).first()
        }

        return response.json(favorite)
    }

    async index(request: RestaurantRequest, response: Response) {
        const { user_id }  = request.query
        const isAdmin = z.coerce.boolean().parse(request.admin.isAdmin)
        
        let favorites = await knex('favorites').where({ user_id })

        if(isAdmin) {
            favorites = await knex('favorites').where({ isAdmin }).where({ user_id})
        }

        return response.json(favorites)
    }

}

module.exports = FavoritesControllers