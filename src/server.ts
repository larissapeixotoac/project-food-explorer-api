require('express-async-errors')

import dotenv from 'dotenv'
import express from 'express'
const cors = require('cors')

import routes from './routes'
// const database = require('./database/sqlite')
const uploadConfig = require('./configs/upload')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3333

// database()

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))
app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))