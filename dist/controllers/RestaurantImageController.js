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

// src/configs/upload.ts
var require_upload = __commonJS({
  "src/configs/upload.ts"(exports2, module2) {
    "use strict";
    var import_multer = __toESM(require("multer"));
    var import_crypto = __toESM(require("crypto"));
    var path2 = require("path");
    var TMP_FOLDER = path2.resolve(__dirname, "..", "tmp");
    var UPLOADS_FOLDER = path2.resolve(TMP_FOLDER, "uploads");
    var MULTER = {
      storage: import_multer.default.diskStorage({
        destination: TMP_FOLDER,
        filename(request, file, callback) {
          const fileHash = import_crypto.default.randomBytes(10).toString("hex");
          const fileName = `${fileHash}-${file.originalname}`;
          return callback(null, fileName);
        }
      })
    };
    module2.exports = {
      TMP_FOLDER,
      UPLOADS_FOLDER,
      MULTER
    };
  }
});

// src/providers/DiskStorage.ts
var require_DiskStorage = __commonJS({
  "src/providers/DiskStorage.ts"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var path2 = require("path");
    var uploadConfig = require_upload();
    var DiskStorage2 = class {
      async saveFile(file) {
        await fs.promises.rename(
          path2.resolve(uploadConfig.TMP_FOLDER, file),
          path2.resolve(uploadConfig.UPLOADS_FOLDER, file)
        );
        return file;
      }
      async deleteFile(file) {
        const filePath = path2.resolve(uploadConfig.UPLOADS_FOLDER, file);
        try {
          await fs.promises.stat(filePath);
        } catch {
          return;
        }
        await fs.promises.unlink(filePath);
      }
    };
    module2.exports = DiskStorage2;
  }
});

// src/controllers/RestaurantImageController.ts
var import_http_status_codes = require("http-status-codes");
var knex = require_knex();
var DiskStorage = require_DiskStorage();
var RestaurantImageController = class {
  async update(request, response) {
    const { dish_id } = request.body;
    const imageFileName = request.file?.filename;
    if (!imageFileName) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Imagem n\xE3o encontrada.");
    }
    const diskStorage = new DiskStorage();
    const dish = await knex("restaurant").where({ id: dish_id }).first();
    if (!dish) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Prato n\xE3o encontrado.");
    }
    if (dish.image) {
      await diskStorage.deleteFile(dish.image);
    }
    const filename = await diskStorage.saveFile(imageFileName);
    dish.image = filename;
    await knex("restaurant").update(dish).where({ id: dish_id });
    return response.status(import_http_status_codes.StatusCodes.OK).json(dish);
  }
};
module.exports = RestaurantImageController;
