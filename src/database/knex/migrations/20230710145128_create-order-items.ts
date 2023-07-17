import { Knex } from "knex";
import { EtablesName } from "../../ETablesName";

export async function up(knex: Knex) {
    return knex.schema.createTable(EtablesName.orderItems, table => {
        table.bigIncrements('id').primary().index()
        table.integer('dish_id').references('id').inTable('restaurant')
        table.integer('quantity')
        table.integer('price')
        table.integer('order_id').references('id').inTable('orders')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
        .then(() => {
            console.log(`# Created table ${EtablesName.orderItems}`)
        })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(EtablesName.orderItems)
        .then(() => {
            console.log(`# Dropped table ${EtablesName.orderItems}`)
        })
}
