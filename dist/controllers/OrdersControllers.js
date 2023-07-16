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

// src/controllers/OrdersControllers.ts
var import_http_status_codes = require("http-status-codes");
var knex = require_knex();
var OrdersControllers = class {
  async finalizeOrder(request, response) {
    const user_id = request.admin.id;
    const openOrder = await knex("orders").where({ user_id }).where({ status: "open" }).first();
    const [payment_id] = await knex("payment").insert({
      status: "pending",
      user_id,
      order_id: openOrder.id
    });
    await knex("orders").where({ id: openOrder.id }).update({
      status: "pending",
      payment_id
    }).update("updated_at", knex.fn.now());
    await knex("orders").insert({
      status: "open",
      payment_id: null,
      user_id
    });
    return response.status(import_http_status_codes.StatusCodes.OK).json("Pedido feito, aguardando confirma\xE7\xE3o do pagamento.");
  }
  async updateStatus(request, response) {
    const { id } = request.params;
    const order = await knex("orders").where({ id }).first();
    if (order.status === "delivered") {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Esse pedido j\xE1 foi finalizado.");
    }
    if (order.status === "preparing") {
      await knex("orders").where({ id }).update({
        status: "delivered"
      }).update("updated_at", knex.fn.now());
    } else {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("O pagamento ainda n\xE3o foi confirmado.");
    }
    return response.status(import_http_status_codes.StatusCodes.OK).json("O estatos do pedido foi alterado.");
  }
  async showOrders(request, response) {
    const user_id = request.admin.id;
    let orders = await knex("orders").where({ user_id });
    if (request.admin.isAdmin === 1) {
      orders = await knex("orders");
    }
    const items = await knex("order-items");
    const ordersWithItems = orders.map((order) => {
      const dishes = items.filter((item) => item.order_id === order.id);
      return {
        ...order,
        dishes
      };
    });
    return response.status(import_http_status_codes.StatusCodes.OK).json(ordersWithItems);
  }
  async index(request, response) {
    const { id } = request.params;
    const user_id = request.admin.id;
    let checkOrder = await knex("orders").where({ user_id }).where({ id }).first();
    if (request.admin.isAdmin) {
      checkOrder = await knex("orders").where({ id }).first();
    }
    if (!checkOrder) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("A ordem n\xE3o existe");
    }
    const items = await knex("order-items");
    const dishes = items.filter((item) => item.order_id === checkOrder.id);
    const orderWithItems = {
      ...checkOrder,
      dishes
    };
    return response.status(import_http_status_codes.StatusCodes.OK).json(orderWithItems);
  }
};
module.exports = OrdersControllers;
