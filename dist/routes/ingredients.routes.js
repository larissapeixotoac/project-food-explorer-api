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

// src/controllers/IngredientsController.ts
var require_IngredientsController = __commonJS({
  "src/controllers/IngredientsController.ts"(exports, module2) {
    "use strict";
    var knex = require_knex();
    var TagsController = class {
      async index(request, response) {
        const { dish_id } = request.query;
        const ingredients = await knex("ingredients").where({ dish_id });
        return response.json(ingredients);
      }
    };
    module2.exports = TagsController;
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
    function ensureAuthenticared(request, response, next) {
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
    module2.exports = ensureAuthenticared;
  }
});

// src/routes/ingredients.routes.ts
var ingredients_routes_exports = {};
__export(ingredients_routes_exports, {
  default: () => ingredients_routes_default
});
module.exports = __toCommonJS(ingredients_routes_exports);
var import_express = require("express");
var IngredientsController = require_IngredientsController();
var ensureAuthenticated = require_ensureAuthenticared();
var restaurantRoutes = (0, import_express.Router)();
var ingredientsController = new IngredientsController();
restaurantRoutes.get("/", ensureAuthenticated, ingredientsController.index);
var ingredients_routes_default = restaurantRoutes;
