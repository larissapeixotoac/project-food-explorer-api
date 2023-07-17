import { Knex } from "knex";
import { EtablesName } from "../../ETablesName";

export async function up(knex: Knex) {
    return knex.schema.createTable(EtablesName.restaurant, table => {
        table.bigIncrements('id').primary().index()
        table.string('dish_name', 150).index()
        table.text('category').index()
        table.integer('price')
        table.text('description')
        table.string('image')
        table.integer('admin_id').references('id').inTable('admins')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
        .then(() => {
            console.log(`# Created table ${EtablesName.restaurant}`)
        })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(EtablesName.restaurant)
        .then(() => {
            console.log(`# Dropped table ${EtablesName.restaurant}`)
        })
}