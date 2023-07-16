import { Router } from 'express'

import { AdminsControllers } from '../controllers/AdminsControllers'

const adminsRoutes = Router()
const adminsControllers = new AdminsControllers()

adminsRoutes.post('/', adminsControllers.create)

export default adminsRoutes