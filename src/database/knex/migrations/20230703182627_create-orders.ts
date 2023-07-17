import { Knex } from "knex";
import { EtablesName } from "../../ETablesName";

export async function up(knex: Knex) {
    return knex.schema.createTable(EtablesName.orders, table => {
        table.bigIncrements('id').primary().index()
        table.text('status').index() 
        table.integer('payment_id').references('id').inTable('payment')
        table.integer('user_id').references('id').inTable('users')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
        .then(() => {
            console.log(`# Created table ${EtablesName.orders}`)
        })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(EtablesName.orders)
        .then(() => {
            console.log(`# Dropped table ${EtablesName.orders}`)
        })
}