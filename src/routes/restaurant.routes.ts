import { Router} from 'express'
import multer from 'multer'

const RestaurantControllers = require('../controllers/RestaurantControllers')
const RestaurantImageController = require('../controllers/RestaurantImageController')
const ensureAuthenticared = require('../middleware/ensureAuthenticared')
const uploadConfig = require('../configs/upload')

const restaurantRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const restaurantControllers = new RestaurantControllers
const restaurantImageController = new RestaurantImageController

restaurantRoutes.use(ensureAuthenticared)

restaurantRoutes.post('/', restaurantControllers.createDish)
restaurantRoutes.put('/:id', restaurantControllers.update)
restaurantRoutes.delete('/:id', restaurantControllers.delete)
restaurantRoutes.get('/:id', restaurantControllers.show)
restaurantRoutes.get('/', restaurantControllers.index)
restaurantRoutes.patch('/image', ensureAuthenticared, upload.single('image'), restaurantImageController.update)



export default restaurantRoutes