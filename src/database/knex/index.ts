import { knex } from 'knex'
import { development, production } from './knexfile'

const getEnviroment = () => {
    switch (process.env.NODE_ENV) {
        case 'prodction': return production

        default: return development
    }
}

const connection = knex(getEnviroment())

module.exports = connection