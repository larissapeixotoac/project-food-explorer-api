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

// src/controllers/FavoritesControllers.ts
var require_FavoritesControllers = __commonJS({
  "src/controllers/FavoritesControllers.ts"(exports, module2) {
    "use strict";
    var import_http_status_codes = require("http-status-codes");
    var import_zod = require("zod");
    var knex = require_knex();
    var FavoritesControllers2 = class {
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
    module2.exports = FavoritesControllers2;
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

// src/routes/favorites.routes.ts
var favorites_routes_exports = {};
__export(favorites_routes_exports, {
  default: () => favorites_routes_default
});
module.exports = __toCommonJS(favorites_routes_exports);
var import_express = require("express");
var FavoritesControllers = require_FavoritesControllers();
var ensureAuthenticared = require_ensureAuthenticared();
var favoritesRoutes = (0, import_express.Router)();
var favoritesControllers = new FavoritesControllers();
favoritesRoutes.use(ensureAuthenticared);
favoritesRoutes.post("/", favoritesControllers.addDish);
favoritesRoutes.delete("/:dish_id", favoritesControllers.removeFavorites);
favoritesRoutes.get("/:dish_id", favoritesControllers.show);
favoritesRoutes.get("/", favoritesControllers.index);
var favorites_routes_default = favoritesRoutes;
