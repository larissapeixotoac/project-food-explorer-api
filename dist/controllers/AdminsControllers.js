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

// src/controllers/AdminsControllers.ts
var AdminsControllers_exports = {};
__export(AdminsControllers_exports, {
  AdminsControllers: () => AdminsControllers
});
module.exports = __toCommonJS(AdminsControllers_exports);
var import_bcryptjs2 = require("bcryptjs");
var import_http_status_codes2 = require("http-status-codes");

// src/controllers/UsersControllers.ts
var import_bcryptjs = require("bcryptjs");
var import_zod = require("zod");
var import_http_status_codes = require("http-status-codes");
var knex = require_knex();
var createUserSchema = import_zod.z.object({
  name: import_zod.z.string().nonempty("O nome \xE9 obrigat\xF3rio"),
  email: import_zod.z.string().nonempty("O e-mail \xE9 obrigat\xF3rio").includes("@", { message: "E-mail inv\xE1lido." }),
  password: import_zod.z.string().nonempty("A senha \xE9 obrigat\xF3ria").min(6, "A senh\xE1 precisa ter pelo menos 6 caracteres.")
});

// src/controllers/AdminsControllers.ts
var knex2 = require_knex();
var AdminsControllers = class {
  async create(request, response) {
    const { name, email, password } = request.body;
    const resultValidation = createUserSchema.safeParse({
      name,
      email,
      password
    });
    if (resultValidation.success === false) {
      const { name: name2, email: email2, password: password2 } = resultValidation.error.format();
      if (name2) {
        return response.status(import_http_status_codes2.StatusCodes.BAD_REQUEST).json(name2?._errors[0]);
      }
      if (email2) {
        return response.status(import_http_status_codes2.StatusCodes.BAD_REQUEST).json(email2?._errors[0]);
      }
      if (password2) {
        return response.status(import_http_status_codes2.StatusCodes.BAD_REQUEST).json(password2?._errors[0]);
      }
      return response.status(import_http_status_codes2.StatusCodes.BAD_REQUEST).json();
    }
    const pssLenght = String(password).length;
    const checkIfUserExist = await knex2("users").where({ email }).first();
    const checkIfADminExist = await knex2("admins").where({ email }).first();
    if (checkIfUserExist) {
      return response.status(import_http_status_codes2.StatusCodes.BAD_REQUEST).json("E-mail j\xE1 cadastrado.");
    }
    if (checkIfADminExist) {
      return response.status(import_http_status_codes2.StatusCodes.BAD_REQUEST).json("E-mail j\xE1 cadastrado.");
    }
    if (pssLenght < 6) {
      return response.status(import_http_status_codes2.StatusCodes.BAD_REQUEST).json("A senha precisa ter pelo menos 6 caracteres.");
    }
    const hashedPasword = await (0, import_bcryptjs2.hash)(password, 8);
    const [id] = await knex2("admins").insert({
      name,
      email,
      password: hashedPasword
    });
    return response.json("Administrador cadastrado com sucesso.");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AdminsControllers
});
