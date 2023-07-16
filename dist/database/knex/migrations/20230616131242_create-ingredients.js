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

// src/database/knex/migrations/20230616131242_create-ingredients.ts
var create_ingredients_exports = {};
__export(create_ingredients_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(create_ingredients_exports);
async function up(knex) {
  return knex.schema.createTable("ingredients" /* ingredients */, (table) => {
    table.bigIncrements("id").primary().index();
    table.string("name", 150).index();
    table.integer("dish_id").references("id").inTable("restaurant").onDelete("CASCADE");
    table.integer("admin_id").references("id").inTable("admins");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  }).then(() => {
    console.log(`# Created table ${"ingredients" /* ingredients */}`);
  });
}
async function down(knex) {
  return knex.schema.dropTable("ingredients" /* ingredients */).then(() => {
    console.log(`# Dropped table ${"ingredients" /* ingredients */}`);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
