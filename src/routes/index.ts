import { Router } from 'express'

import usersRoutes from './users.routes'
import adminsRoutes from './admins.routes'
import restaurantRoutes from './restaurant.routes'
import sessionsRoutes from './sessions.routes'
import ingredientsRoutes from './ingredients.routes'
import favoritesRoutes from './favorites.routes'
import ordersRoutes from './orders.routes'
import orderItemsRoutes from './orderItems.routes'
import paymentRoute from './payment.routes'

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)
routes.use('/admins', adminsRoutes)
routes.use('/restaurant', restaurantRoutes)
routes.use('/ingredients', ingredientsRoutes)
routes.use('/favorites', favoritesRoutes)
routes.use('/orders', ordersRoutes)
routes.use('/orderitems', orderItemsRoutes)
routes.use('/payment', paymentRoute)

export default routes