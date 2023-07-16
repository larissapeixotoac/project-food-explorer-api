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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

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
  "src/database/knex/index.ts"(exports, module2) {
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

// src/controllers/PaymentController.ts
var require_PaymentController = __commonJS({
  "src/controllers/PaymentController.ts"(exports, module2) {
    "use strict";
    var import_http_status_codes = require("http-status-codes");
    var knex = require_knex();
    var PaymentController2 = class {
      async update(request, response) {
        const { id, status } = request.body;
        const order_id = Number(id);
        const order = await knex("orders").where({ id: order_id }).first();
        if (order.status === "open") {
          return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Esse pedido ainda est\xE1 aberto.");
        }
        if (order.status === "delivered") {
          return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Esse pedido j\xE1 foi finalizado.");
        }
        if (order.status === "preparing" && status === "canceled" || order.status === "pending" && status === "canceled") {
          await knex("payment").where({ user_id: order.user_id }).where({ order_id }).update({
            status: "canceled"
          }).update("updated_at", knex.fn.now());
          await knex("orders").where({ id: order_id }).update({
            status: "canceled"
          }).update("updated_at", knex.fn.now());
          return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Problema no pagamento, pedido cancelado.");
        }
        if (status === "preparing") {
          await knex("payment").where({ user_id: order.user_id }).where({ order_id }).update({
            status: "paid"
          }).update("updated_at", knex.fn.now());
          await knex("orders").where({ id: order_id }).update({
            status
          }).update("updated_at", knex.fn.now());
          return response.status(import_http_status_codes.StatusCodes.OK).json("Pagamento confirmado.");
        }
      }
    };
    module2.exports = PaymentController2;
  }
});

// src/configs/auth.ts
var require_auth = __commonJS({
  "src/configs/auth.ts"(exports, module2) {
    "use strict";
    module2.exports = {
      jwt: {
        secret: process.env.AUTH_SECRET || "default",
        expiresIn: "1d"
      }
    };
  }
});

// src/middleware/ensureAuthenticared.ts
var require_ensureAuthenticared = __commonJS({
  "src/middleware/ensureAuthenticared.ts"(exports, module2) {
    "use strict";
    var import_http_status_codes = require("http-status-codes");
    var { verify } = require("jsonwebtoken");
    var authConfig = require_auth();
    function ensureAuthenticared2(request, response, next) {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("JWT Token n\xE3o informado.");
      }
      const [, token] = authHeader.split(" ");
      try {
        const { sub: admin_id, jti: isAdmin } = verify(token, authConfig.jwt.secret);
        request.admin = {
          id: Number(admin_id),
          isAdmin: Number(isAdmin)
        };
        return next();
      } catch {
        return response.status(import_http_status_codes.StatusCodes.FORBIDDEN).json("JWT Token inv\xE1lido.");
      }
    }
    module2.exports = ensureAuthenticared2;
  }
});

// src/routes/payment.routes.ts
var payment_routes_exports = {};
__export(payment_routes_exports, {
  default: () => payment_routes_default
});
module.exports = __toCommonJS(payment_routes_exports);
var import_express = require("express");
var PaymentController = require_PaymentController();
var ensureAuthenticared = require_ensureAuthenticared();
var paymentRoute = (0, import_express.Router)();
var paymentController = new PaymentController();
paymentRoute.use(ensureAuthenticared);
paymentRoute.put("/", paymentController.update);
var payment_routes_default = paymentRoute;
