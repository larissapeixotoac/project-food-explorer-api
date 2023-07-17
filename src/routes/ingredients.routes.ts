import { Router } from 'express'

const IngredientsController = require('../controllers/IngredientsController')
const ensureAuthenticated = require('../middleware/ensureAuthenticared')

const restaurantRoutes = Router()
const ingredientsController = new IngredientsController

restaurantRoutes.get('/', ensureAuthenticated, ingredientsController.index)


export default restaurantRoutes