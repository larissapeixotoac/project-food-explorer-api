import { Knex } from 'knex';
import path from 'path'
import { development, production } from './src/database/knex/knexfile'

module.exports = {
    development,
    production
}

