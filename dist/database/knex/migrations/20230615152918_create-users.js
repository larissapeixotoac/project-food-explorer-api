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

// src/database/knex/migrations/20230615152918_create-users.ts
var create_users_exports = {};
__export(create_users_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(create_users_exports);
async function up(knex) {
  return knex.schema.createTable("users" /* users */, (table) => {
    table.bigIncrements("id").primary().index();
    table.binary("isAdmin").defaultTo(0);
    table.string("name", 150).index();
    table.string("email").index();
    table.string("password", 8);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  }).then(() => {
    console.log(`# Created table ${"users" /* users */}`);
  });
}
async function down(knex) {
  return knex.schema.dropTable("users" /* users */).then(() => {
    console.log(`# Dropped table ${"users" /* users */}`);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
