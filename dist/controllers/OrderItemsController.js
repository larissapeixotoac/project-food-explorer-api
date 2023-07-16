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

// src/controllers/OrderItemsController.ts
var import_http_status_codes = require("http-status-codes");
var knex = require_knex();
var OrderItemsController = class {
  async addItem(request, response) {
    const { dish_id, quantity } = request.body;
    const user_id = request.admin.id;
    const isAdmin = request.admin.isAdmin;
    if (isAdmin === 1) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Administradores n\xE3o podem fazer pedidos.");
    }
    const dish = await knex("restaurant").where({ id: dish_id }).first();
    if (!dish) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Prato n\xE3o encontrado.");
    }
    const openOrder = await knex("orders").where({ user_id }).where({ status: "open" }).first();
    const checkDishOnOrder = await knex("order-items").where({ order_id: openOrder.id }).where({ dish_id }).first();
    if (checkDishOnOrder) {
      await knex("order-items").where({ order_id: openOrder.id }).where({ dish_id }).update({
        quantity,
        price: dish.price
      }).update("updated_at", knex.fn.now());
    } else {
      await knex("order-items").insert({
        dish_id,
        quantity,
        price: dish.price,
        order_id: openOrder.id
      });
    }
    await knex("orders").where({ id: openOrder.id }).update("updated_at", knex.fn.now());
    return response.status(import_http_status_codes.StatusCodes.CREATED).json("Item adicionado.");
  }
  async delete(request, response) {
    const { dish_id } = request.query;
    const user_id = request.admin?.id;
    const isAdmin = request.admin.isAdmin;
    if (isAdmin === 1) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Administradores n\xE3o deletar itens dos usu\xE1rios.");
    }
    const openOrder = await knex("orders").where({ user_id }).where({ status: "open" }).first();
    await knex("order-items").where({ order_id: openOrder.id }).where({ dish_id }).delete();
    await knex("orders").where({ id: openOrder.id }).update("updated_at", knex.fn.now());
    return response.status(import_http_status_codes.StatusCodes.OK).json("Item exclu\xEDdo do pedido.");
  }
  async showItems(request, response) {
    const user_id = request.admin.id;
    const openOrder = await knex("orders").where({ user_id }).where({ status: "open" }).first();
    const checkDishOnOrder = await knex("order-items").where({ order_id: openOrder.id });
    return response.status(import_http_status_codes.StatusCodes.OK).json(checkDishOnOrder);
  }
};
module.exports = OrderItemsController;
