import { Knex } from 'knex';
import path from 'path'

// module.exports = {
//     development: {
//         client: 'sqlite3',
//         useNullAsDefault: true,
//         connection: {
//             filename: path.resolve(__dirname, '..', '..', '..', 'food-explorer.sqlite'),
//         },
//         migrations: {
//             directory: path.resolve(__dirname, 'migrations')
//         },
//         pool: {
//             afterCreate: (connection: any, done: Function) => {
//                 connection.run('PRAGMA foreign_keys = ON')
//                 done()
//             }
//         }
//     }
// }

export const development: Knex.Config = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: path.resolve(__dirname, '..', '..', '..', 'food-explorer.sqlite'),
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