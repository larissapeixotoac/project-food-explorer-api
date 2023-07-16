import { Knex } from "knex";
import { EtablesName } from "../../ETablesName";

export async function up(knex: Knex) {
    return knex.schema.createTable(EtablesName.users, table => {
        table.bigIncrements('id').primary().index()
        table.binary("isAdmin").defaultTo(0)
        table.string('name', 150).index()
        table.string('email').index()
        table.string('password', 8)
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
        .then(() => {
            console.log(`# Created table ${EtablesName.users}`)
        })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(EtablesName.users)
        .then(() => {
            console.log(`# Dropped table ${EtablesName.users}`)
        })
}
