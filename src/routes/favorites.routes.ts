import { Router } from 'express'

const FavoritesControllers = require('../controllers/FavoritesControllers')
const ensureAuthenticared = require('../middleware/ensureAuthenticared')

const favoritesRoutes = Router()
const favoritesControllers = new FavoritesControllers

favoritesRoutes.use(ensureAuthenticared)

favoritesRoutes.post('/', favoritesControllers.addDish)
favoritesRoutes.delete('/:dish_id', favoritesControllers.removeFavorites)
favoritesRoutes.get('/:dish_id', favoritesControllers.show)
favoritesRoutes.get('/', favoritesControllers.index)

export default favoritesRoutes