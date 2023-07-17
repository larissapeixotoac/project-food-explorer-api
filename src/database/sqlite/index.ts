import sqlite3 from 'sqlite3'
import sqlite from 'sqlite'
import path from 'path'

async function sqliteConnection() {
    const database = await new sqlite3.Database(
        __filename = path.resolve(__dirname, '..', '..', '..', 'food-explorer.sqlite')
    )

    return database
}

module.exports = sqliteConnection