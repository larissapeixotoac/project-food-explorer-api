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

// src/routes/sessions.routes.ts
var sessions_routes_exports = {};
__export(sessions_routes_exports, {
  default: () => sessions_routes_default
});
module.exports = __toCommonJS(sessions_routes_exports);
var import_express = require("express");

// src/controllers/SessionsController.ts
var import_bcryptjs = require("bcryptjs");
var import_http_status_codes = require("http-status-codes");
var { sign } = require("jsonwebtoken");
var knex = require_knex();
var authConfig = require_auth();
var SessionsController = class {
  async create(request, response) {
    const { email, password } = request.body;
    const user = await knex("users").where({ email }).first();
    const admin = await knex("admins").where({ email }).first();
    if (!user && !admin) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("E-mail e/ou senha incorretos.");
    }
    if (user) {
      const checkPassword = await (0, import_bcryptjs.compare)(password, user.password);
      if (!checkPassword) {
        return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("E-mail e/ou senha incorretos.");
      }
    }
    if (admin) {
      const checkPassword = await (0, import_bcryptjs.compare)(password, admin.password);
      if (!checkPassword) {
        return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("E-mail e/ou senha incorretos.");
      }
    }
    const { secret, expiresIn } = authConfig.jwt;
    let token;
    if (user) {
      token = sign({}, secret, {
        subject: String(user.id),
        expiresIn,
        jwtid: "0"
      });
    }
    if (admin) {
      token = sign({}, secret, {
        subject: String(admin.id),
        expiresIn,
        jwtid: "1"
      });
    }
    if (user) {
      return response.json({ user, token });
    }
    if (admin) {
      return response.json({ admin, token });
    }
  }
};

// src/routes/sessions.routes.ts
var sessionsRoutes = (0, import_express.Router)();
var sessionsController = new SessionsController();
sessionsRoutes.post("/", sessionsController.create);
var sessions_routes_default = sessionsRoutes;
