import { Request, Response } from 'express'
const knex = require('../database/knex')

class TagsController {
    async index(request: Request, response: Response) {
        const { dish_id }  = request.query
        
        const ingredients = await knex('ingredients').where({ dish_id })

        return response.json(ingredients)
    }
}


module.exports = TagsController