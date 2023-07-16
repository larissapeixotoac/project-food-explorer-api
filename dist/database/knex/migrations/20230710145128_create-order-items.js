"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/database/knex/migrations/20230710145128_create-order-items.ts
var create_order_items_exports = {};
__export(create_order_items_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(create_order_items_exports);
async function up(knex) {
  return knex.schema.createTable("order-items" /* orderItems */, (table) => {
    table.bigIncrements("id").primary().index();
    table.integer("dish_id").references("id").inTable("restaurant");
    table.integer("quantity");
    table.integer("price");
    table.integer("order_id").references("id").inTable("orders");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  }).then(() => {
    console.log(`# Created table ${"order-items" /* orderItems */}`);
  });
}
async function down(knex) {
  return knex.schema.dropTable("order-items" /* orderItems */).then(() => {
    console.log(`# Dropped table ${"order-items" /* orderItems */}`);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
