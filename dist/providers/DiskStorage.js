"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var fs = require("fs");
var path = require("path");
var uploadConfig = require_upload();
var DiskStorage = class {
  async saveFile(file) {
    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    );
    return file;
  }
  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);
    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }
    await fs.promises.unlink(filePath);
  }
};
module.exports = DiskStorage;
