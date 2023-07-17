import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')

class RestaurantImageController {    
    async update(request: Request, response: Response) {
        const { dish_id }= request.body
        const imageFileName = request.file?.filename
        
        if(!imageFileName) {
            return response.status(StatusCodes.BAD_REQUEST).json("Imagem não encontrada.")
        }

        const diskStorage = new DiskStorage()

        const dish = await knex('restaurant').where({ id: dish_id }).first()

        if(!dish) {
            return response.status(StatusCodes.BAD_REQUEST).json("Prato não encontrado.")
        }

        if(dish.image) {
            await diskStorage.deleteFile(dish.image)
        }
        const filename = await diskStorage.saveFile(imageFileName)
        dish.image = filename

        await knex('restaurant').update(dish).where({ id: dish_id })

        return response.status(StatusCodes.OK).json(dish)
    }
}

module.exports = RestaurantImageController