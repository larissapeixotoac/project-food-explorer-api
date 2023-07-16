import { Router } from 'express'

const PaymentController = require('../controllers/PaymentController')
const ensureAuthenticared = require('../middleware/ensureAuthenticared')

const paymentRoute = Router()
const paymentController = new PaymentController

paymentRoute.use(ensureAuthenticared)

paymentRoute.put('/', paymentController.update)

export default paymentRoute