import { Router } from 'express'

import { UsersControllers } from '../controllers/UsersControllers'

const usersRoutes = Router()
const usersControllers = new UsersControllers()

usersRoutes.post('/', usersControllers.create)

export default usersRoutes