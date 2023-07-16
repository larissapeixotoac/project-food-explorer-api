"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/database/knex/index.ts
var import_knex = require("knex");

// src/database/knex/knexfile.ts
var import_path = __toESM(require("path"));
var development = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: import_path.default.resolve(__dirname, "..", "food-explorer.sqlite")
  },
  migrations: {
    directory: import_path.default.resolve(__dirname, "migrations")
  },
  pool: {
    afterCreate: (connection2, done) => {
      connection2.run("PRAGMA foreign_keys = ON");
      done();
    }
  }
};
var production = {
  ...development
};

// src/database/knex/index.ts
var getEnviroment = () => {
  switch (process.env.NODE_ENV) {
    case "prodction":
      return production;
    default:
      return development;
  }
};
var connection = (0, import_knex.knex)(getEnviroment());
module.exports = connection;
