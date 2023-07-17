import { Knex } from 'knex';
import path from 'path'

export const development: Knex.Config = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: filename: './food-explorer.sqlite', //on render, using build the database go to the root
        //filename: path.resolve(__dirname, '..', '..', '..', 'food-explorer.sqlite') /using npm rum dev works as should be
    },
    migrations: {
        directory: path.resolve(__dirname, 'migrations')
    },
    pool: {
        afterCreate: (connection: any, done: Function) => {
            connection.run('PRAGMA foreign_keys = ON')
            done()
        }
    }
}

export const production: Knex.Config = {
    ...development,
  };
