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

// src/database/knex/migrations/20230628201825_create-favorites.ts
var create_favorites_exports = {};
__export(create_favorites_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(create_favorites_exports);
async function up(knex) {
  return knex.schema.createTable("favorites" /* favorites */, (table) => {
    table.bigIncrements("id").primary().index();
    table.integer("dish_id").references("id").inTable("restaurant").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.binary("isAdmin").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  }).then(() => {
    console.log(`# Created table ${"favorites" /* favorites */}`);
  });
}
async function down(knex) {
  return knex.schema.dropTable("favorites" /* favorites */).then(() => {
    console.log(`# Dropped table ${"favorites" /* favorites */}`);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
