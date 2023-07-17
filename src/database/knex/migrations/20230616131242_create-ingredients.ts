import { Knex } from "knex";
import { EtablesName } from "../../ETablesName";

export async function up(knex: Knex) {
    return knex.schema.createTable(EtablesName.ingredients, table => {
        table.bigIncrements('id').primary().index()
        table.string('name', 150).index()
        table.integer('dish_id').references('id').inTable('restaurant').onDelete('CASCADE')
        table.integer('admin_id').references('id').inTable('admins')
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
        .then(() => {
            console.log(`# Created table ${EtablesName.ingredients}`)
        })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(EtablesName.ingredients)
        .then(() => {
            console.log(`# Dropped table ${EtablesName.ingredients}`)
        })
}