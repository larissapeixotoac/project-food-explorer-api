"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// src/database/knex/knexfile.ts
var import_path, development, production;
var init_knexfile = __esm({
  "src/database/knex/knexfile.ts"() {
    "use strict";
    import_path = __toESM(require("path"));
    development = {
      client: "sqlite3",
      useNullAsDefault: true,
      connection: {
        filename: import_path.default.resolve(__dirname, "..", "food-explorer.sqlite")
      },
      migrations: {
        directory: import_path.default.resolve(__dirname, "migrations")
      },
      pool: {
        afterCreate: (connection, done) => {
          connection.run("PRAGMA foreign_keys = ON");
          done();
        }
      }
    };
    production = {
      ...development
    };
  }
});

// src/database/knex/index.ts
var require_knex = __commonJS({
  "src/database/knex/index.ts"(exports2, module2) {
    "use strict";
    var import_knex = require("knex");
    init_knexfile();
    var getEnviroment = () => {
      switch (process.env.NODE_ENV) {
        case "prodction":
          return production;
        default:
          return development;
      }
    };
    var connection = (0, import_knex.knex)(getEnviroment());
    module2.exports = connection;
  }
});

// src/controllers/FavoritesControllers.ts
var import_http_status_codes = require("http-status-codes");
var import_zod = require("zod");
var knex = require_knex();
var FavoritesControllers = class {
  async addDish(request, response) {
    const { dish_id, user_id } = request.body;
    const isAdmin = import_zod.z.coerce.boolean().parse(request.admin.isAdmin);
    const dish = await knex("restaurant").where({ id: dish_id }).first();
    if (!dish) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Esse prato n\xE3o existe.");
    }
    const checkIfUserExist = await knex("users").where({ id: user_id }).first();
    const checkIfAdminExist = await knex("admins").where({ id: user_id }).first();
    if (!checkIfUserExist && !checkIfAdminExist) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Esse usu\xE1rio n\xE3o existe.");
    }
    const newFavorite = {
      dish_id: dish.id,
      user_id: checkIfUserExist.id,
      isAdmin: isAdmin ? 1 : 0
    };
    await knex("favorites").insert(newFavorite);
    return response.status(import_http_status_codes.StatusCodes.OK).json("Favoritado!");
  }
  async removeFavorites(request, response) {
    const { dish_id } = request.params;
    await knex("favorites").where({ dish_id }).delete();
    return response.status(import_http_status_codes.StatusCodes.OK).json("Desfavoritado.");
  }
  async show(request, response) {
    const { dish_id } = request.params;
    const user_id = request.admin.id;
    const isAdmin = import_zod.z.coerce.boolean().parse(request.admin.isAdmin);
    let favorite = await knex("favorites").where({ user_id }).where({ isAdmin }).where({ dish_id }).first();
    if (isAdmin) {
      favorite = await knex("favorites").where({ isAdmin }).where({ dish_id }).first();
    }
    return response.json(favorite);
  }
  async index(request, response) {
    const { user_id } = request.query;
    const isAdmin = import_zod.z.coerce.boolean().parse(request.admin.isAdmin);
    let favorites = await knex("favorites").where({ user_id });
    if (isAdmin) {
      favorites = await knex("favorites").where({ isAdmin }).where({ user_id });
    }
    return response.json(favorites);
  }
};
module.exports = FavoritesControllers;
