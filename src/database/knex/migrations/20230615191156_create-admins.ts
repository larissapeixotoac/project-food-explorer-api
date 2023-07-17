import { Knex } from "knex";
import { EtablesName } from "../../ETablesName";

export async function up(knex: Knex) {
    return knex.schema.createTable(EtablesName.admins, table => {
        table.bigIncrements('id').primary().index()
        table.binary("isAdmin").defaultTo(1)
        table.string('name', 150).index()
        table.string('email').index()
        table.string('password', 8)
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
        .then(() => {
            console.log(`# Created table ${EtablesName.admins}`)
        })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(EtablesName.admins)
        .then(() => {
            console.log(`# Dropped table ${EtablesName.admins}`)
        })
}