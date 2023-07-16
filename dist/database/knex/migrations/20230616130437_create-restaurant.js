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

// src/database/knex/migrations/20230616130437_create-restaurant.ts
var create_restaurant_exports = {};
__export(create_restaurant_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(create_restaurant_exports);
async function up(knex) {
  return knex.schema.createTable("restaurant" /* restaurant */, (table) => {
    table.bigIncrements("id").primary().index();
    table.string("dish_name", 150).index();
    table.text("category").index();
    table.integer("price");
    table.text("description");
    table.string("image");
    table.integer("admin_id").references("id").inTable("admins");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  }).then(() => {
    console.log(`# Created table ${"restaurant" /* restaurant */}`);
  });
}
async function down(knex) {
  return knex.schema.dropTable("restaurant" /* restaurant */).then(() => {
    console.log(`# Dropped table ${"restaurant" /* restaurant */}`);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
