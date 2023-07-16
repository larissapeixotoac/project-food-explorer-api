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

// src/database/knex/migrations/20230615191156_create-admins.ts
var create_admins_exports = {};
__export(create_admins_exports, {
  down: () => down,
  up: () => up
});
module.exports = __toCommonJS(create_admins_exports);
async function up(knex) {
  return knex.schema.createTable("admins" /* admins */, (table) => {
    table.bigIncrements("id").primary().index();
    table.binary("isAdmin").defaultTo(1);
    table.string("name", 150).index();
    table.string("email").index();
    table.string("password", 8);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  }).then(() => {
    console.log(`# Created table ${"admins" /* admins */}`);
  });
}
async function down(knex) {
  return knex.schema.dropTable("admins" /* admins */).then(() => {
    console.log(`# Dropped table ${"admins" /* admins */}`);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  down,
  up
});
