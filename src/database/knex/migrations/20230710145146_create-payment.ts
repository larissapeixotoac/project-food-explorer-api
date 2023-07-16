import { Knex } from "knex";
import { EtablesName } from "../../ETablesName";

export async function up(knex: Knex) {
    return knex.schema.createTable(EtablesName.payment, table => {
        table.bigIncrements('id').primary().index()
        table.text('status').index()         
        table.integer('user_id').references('id').inTable('users')        
        table.integer('order_id').references('id').inTable('orders')  
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
        .then(() => {
            console.log(`# Created table ${EtablesName.payment}`)
        })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(EtablesName.payment)
        .then(() => {
            console.log(`# Dropped table ${EtablesName.payment}`)
        })
}