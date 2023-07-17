import { Router } from 'express'

const OrdersControllers = require('../controllers/OrdersControllers')
const ensureAuthenticared = require('../middleware/ensureAuthenticared')

const ordersRoutes = Router()
const ordersControllers = new OrdersControllers

ordersRoutes.use(ensureAuthenticared)

ordersRoutes.put('/', ordersControllers.finalizeOrder)
ordersRoutes.put('/:id', ordersControllers.updateStatus)
ordersRoutes.get('/:id', ordersControllers.index)
ordersRoutes.get('/', ordersControllers.showOrders)

export default ordersRoutes