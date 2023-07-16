"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/database/ETablesName.ts
var ETablesName_exports = {};
__export(ETablesName_exports, {
  EtablesName: () => EtablesName
});
module.exports = __toCommonJS(ETablesName_exports);
var EtablesName = /* @__PURE__ */ ((EtablesName2) => {
  EtablesName2["users"] = "users";
  EtablesName2["admins"] = "admins";
  EtablesName2["restaurant"] = "restaurant";
  EtablesName2["ingredients"] = "ingredients";
  EtablesName2["favorites"] = "favorites";
  EtablesName2["orders"] = "orders";
  EtablesName2["orderItems"] = "order-items";
  EtablesName2["payment"] = "payment";
  return EtablesName2;
})(EtablesName || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EtablesName
});
