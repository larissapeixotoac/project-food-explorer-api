import { Knex } from "knex";
import { EtablesName } from "../../ETablesName";

export async function up(knex: Knex) {
    return knex.schema.createTable(EtablesName.favorites, table => {
        table.bigIncrements('id').primary().index()
        table.integer('dish_id').references('id').inTable('restaurant').onDelete('CASCADE')
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
        table.binary("isAdmin").defaultTo(0)
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
        .then(() => {
            console.log(`# Created table ${EtablesName.favorites}`)
        })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(EtablesName.favorites)
        .then(() => {
            console.log(`# Dropped table ${EtablesName.favorites}`)
        })
}