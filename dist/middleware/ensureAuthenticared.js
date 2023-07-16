"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/configs/auth.ts
var require_auth = __commonJS({
  "src/configs/auth.ts"(exports2, module2) {
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
module.exports = ensureAuthenticared;
