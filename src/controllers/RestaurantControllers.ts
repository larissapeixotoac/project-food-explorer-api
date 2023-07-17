import { Request, Response } from 'express'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
const knex = require('../database/knex')

interface RestaurantRequest extends Request {
    admin: {
        id: number,
        isAdmin: number
    }
}

const createDish = z.object({
    dish_name: z.string()
        .nonempty("O campo do nome é obrigatório."),
    price: z.string()
        .nonempty("O campo do preço é obrigatório"),
    description: z.string(), 
    ingredients: z.string()
        .array()
        .nonempty("É necessário que o prato tenha pelo menos um ingrediente.")
})

async function ValidateDishes({dish_name, price, description, ingredients}: {dish_name: { _errors: string[]; } | undefined, price: { _errors: string[]; } | undefined, description: { _errors: string[]; } | undefined, ingredients: { _errors: string[]; } | undefined}) {

    if(dish_name) {
        return dish_name?._errors[0]
    }
    if(price) {
        return price?._errors[0]
    }
    if(description) {
        return description?._errors[0]
    }
    if(ingredients) {
        return ingredients?._errors[0]
    }
}
class RestaurantControllers {

    async createDish(request: RestaurantRequest, response: Response) {
        const { dish_name, category, price, description, ingredients } = request.body        
        const admin_id = request.admin.id
        const isAdmin = z.coerce.boolean().parse(request.admin.isAdmin)

        const resultValidation = createDish.safeParse({
            dish_name,
            price, 
            description, 
            ingredients
        })
        
        if(!isAdmin) {
            return response.status(StatusCodes.UNAUTHORIZED).json("Você não tem permissão para criar pratos")
        }
        
        let validatedResult: string | undefined
        
        if(!resultValidation.success) {
            const { dish_name, price, description, ingredients } = resultValidation.error.format()
            validatedResult = await ValidateDishes({ dish_name, price, description, ingredients })
            
            return response.status(StatusCodes.BAD_REQUEST).json(validatedResult)
        }
          
        const checkIfDishExist = await knex('restaurant').where({ dish_name }).first()

        if(checkIfDishExist) {
            return response.status(StatusCodes.BAD_REQUEST).json('Este prato já está cadastrado.')
        }

        const correctPrice = Number(price.replace(/[^\d.,]/g, '').replace(',', '.'))
        
        const [dish_id] = await knex('restaurant').insert({
            dish_name, 
            category, 
            price: correctPrice, 
            description,
            admin_id,
            image: null
        })

        const ingredientsInsert = ingredients.map((name: string) => {
            return {
                dish_id,
                admin_id,
                name
            }
        })

        await knex('ingredients').insert(ingredientsInsert)

        return response.status(StatusCodes.OK).json({message: 'Prato adicionado com sucesso.', dish_id})
    }

    async update(request: RestaurantRequest, response: Response) {
        const { dish_name, category, price, description, ingredients } = request.body
        const admin_id = request.admin.id
        const isAdmin = z.coerce.boolean().parse(request.admin.isAdmin)

        if(!isAdmin) {
            return response.status(StatusCodes.FORBIDDEN).json("Você não tem permissão para editar pratos")
        }
        
        const resultValidation = createDish.safeParse({
            dish_name,
            price, 
            description, 
            ingredients
        })

        if(!resultValidation.success) {
            const { dish_name, price, description, ingredients } = resultValidation.error.format()
            const validatedResult = await ValidateDishes({ dish_name, price, description, ingredients })
            
            return response.status(StatusCodes.BAD_REQUEST).json(validatedResult)
        }

        const dish_id = request.params.id
        const dish = await knex('restaurant').where({ id: dish_id }).first()

        if(!dish) {
            return response.status(StatusCodes.BAD_REQUEST).json('O prato não foi encontrado.')
        }
        
        if(dish_name.length !== 0) {
            dish.dish_name = dish_name
        }
        if(category.length !== 0) {
            dish.category = category
        }
        if(price.length !== 0) {
            dish.price = price
        }
        if(description.length !== 0) {
            dish.description = description
        }
        
        await knex('ingredients').where({ dish_id }).delete()

        const ingredientsInsert = ingredients.map((name: string) => {
            return {
                dish_id,
                admin_id,
                name
            }
        })

        await knex('ingredients').insert(ingredientsInsert)

        const correctPrice = Number(dish.price.replace(/[^\d.,]/g, '').replace(',', '.'))
        
        await knex('restaurant')
            .where({ id: dish_id })
            .update({
                dish_name: dish.dish_name,
                category: dish.category, 
                price: correctPrice, 
                description: dish.description
            })
            .update('updated_at', knex.fn.now())
        
        return response.status(StatusCodes.OK).json('Prato editado com sucesso.')
    }

    async show(request: Request, response: Response) {
        const { id } = request.params

        const dish = await knex('restaurant').where({id}).first()
        const ingredients = await knex('ingredients').where({ dish_id: id}).orderBy('name')

        if(!dish) {
            return response.status(StatusCodes.BAD_REQUEST).json('O prato não foi encontrado.')
        }

        return response.status(StatusCodes.OK).json({
            ...dish,
            ingredients
        })
    }

    async delete(request: RestaurantRequest, response: Response) {
        const { id } = request.params
        const isAdmin = z.coerce.boolean().parse(request.admin.isAdmin)

        if(!isAdmin) {
            return response.status(StatusCodes.UNAUTHORIZED).json("Você não tem permissão para deletar pratos")
        }

        await knex('restaurant').where({ id }).delete()

        return response.status(StatusCodes.OK).json("Prato excluído com sucesso.")
    }

    async index(request: Request, response: Response) {
        const { name, ingredients } = request.query
        let dishes: object[] = []

        if(typeof name === 'string') {
            const filterDishes = name.split(',').map(dish => dish.trim())
            dishes = await knex('restaurant').whereLike('dish_name', `%${filterDishes}%`).orderBy('restaurant.dish_name')
        }        

        if(dishes.length === 0) {
            if(typeof ingredients === 'string') {
                const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim())
                
                dishes = await knex('ingredients')
                    .select([
                        'restaurant.id',
                        'restaurant.dish_name',
                        'restaurant.image',
                        'restaurant.category',
                        'restaurant.price',
                        'restaurant.description'
                    ])
                    .whereIn('name', filterIngredients)          
                    .innerJoin('restaurant', 'restaurant.id', 'ingredients.dish_id')
                    .orderBy('restaurant.dish_name')
            }
        }       
        
        const filteredDishes = dishes.filter((dish:any, index:any, self:any) => {
            return index === self.findIndex((i:any) => i.id === dish.id)
        })
        
        const adminIngredients = await knex('ingredients')
        
        const dishesWithIngredients = filteredDishes.map((dish: any) => {
            const dishIngredients = adminIngredients.filter((ingredient: any) => ingredient.dish_id === dish.id)
            
            return {
                ...dish,
                ingredients: dishIngredients
            }
        })        

        return response.status(StatusCodes.OK).json(dishesWithIngredients)

    }
}

module.exports = RestaurantControllers