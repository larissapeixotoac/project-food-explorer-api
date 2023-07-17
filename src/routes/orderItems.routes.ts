import { Router } from 'express'

const OrderItemsController = require('../controllers/OrderItemsController')
const ensureAuthenticared = require('../middleware/ensureAuthenticared')

const orderItemsRoutes = Router()
const orderItemsController = new OrderItemsController

orderItemsRoutes.use(ensureAuthenticared)

orderItemsRoutes.post('/', orderItemsController.addItem)
orderItemsRoutes.delete('/', orderItemsController.delete)
orderItemsRoutes.get('/', orderItemsController.showItems)

export default orderItemsRoutes