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

// src/controllers/RestaurantControllers.ts
var require_RestaurantControllers = __commonJS({
  "src/controllers/RestaurantControllers.ts"(exports, module2) {
    "use strict";
    var import_zod2 = require("zod");
    var import_http_status_codes4 = require("http-status-codes");
    var knex4 = require_knex();
    var createDish = import_zod2.z.object({
      dish_name: import_zod2.z.string().nonempty("O campo do nome \xE9 obrigat\xF3rio."),
      price: import_zod2.z.string().nonempty("O campo do pre\xE7o \xE9 obrigat\xF3rio"),
      description: import_zod2.z.string(),
      ingredients: import_zod2.z.string().array().nonempty("\xC9 necess\xE1rio que o prato tenha pelo menos um ingrediente.")
    });
    async function ValidateDishes({ dish_name, price, description, ingredients }) {
      if (dish_name) {
        return dish_name?._errors[0];
      }
      if (price) {
        return price?._errors[0];
      }
      if (description) {
        return description?._errors[0];
      }
      if (ingredients) {
        return ingredients?._errors[0];
      }
    }
    var RestaurantControllers2 = class {
      async createDish(request, response) {
        const { dish_name, category, price, description, ingredients } = request.body;
        const admin_id = request.admin.id;
        const isAdmin = import_zod2.z.coerce.boolean().parse(request.admin.isAdmin);
        const resultValidation = createDish.safeParse({
          dish_name,
          price,
          description,
          ingredients
        });
        if (!isAdmin) {
          return response.status(import_http_status_codes4.StatusCodes.UNAUTHORIZED).json("Voc\xEA n\xE3o tem permiss\xE3o para criar pratos");
        }
        let validatedResult;
        if (!resultValidation.success) {
          const { dish_name: dish_name2, price: price2, description: description2, ingredients: ingredients2 } = resultValidation.error.format();
          validatedResult = await ValidateDishes({ dish_name: dish_name2, price: price2, description: description2, ingredients: ingredients2 });
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json(validatedResult);
        }
        const checkIfDishExist = await knex4("restaurant").where({ dish_name }).first();
        if (checkIfDishExist) {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Este prato j\xE1 est\xE1 cadastrado.");
        }
        const correctPrice = Number(price.replace(/[^\d.,]/g, "").replace(",", "."));
        const [dish_id] = await knex4("restaurant").insert({
          dish_name,
          category,
          price: correctPrice,
          description,
          admin_id,
          image: null
        });
        const ingredientsInsert = ingredients.map((name) => {
          return {
            dish_id,
            admin_id,
            name
          };
        });
        await knex4("ingredients").insert(ingredientsInsert);
        return response.status(import_http_status_codes4.StatusCodes.OK).json({ message: "Prato adicionado com sucesso.", dish_id });
      }
      async update(request, response) {
        const { dish_name, category, price, description, ingredients } = request.body;
        const admin_id = request.admin.id;
        const isAdmin = import_zod2.z.coerce.boolean().parse(request.admin.isAdmin);
        if (!isAdmin) {
          return response.status(import_http_status_codes4.StatusCodes.FORBIDDEN).json("Voc\xEA n\xE3o tem permiss\xE3o para editar pratos");
        }
        const resultValidation = createDish.safeParse({
          dish_name,
          price,
          description,
          ingredients
        });
        if (!resultValidation.success) {
          const { dish_name: dish_name2, price: price2, description: description2, ingredients: ingredients2 } = resultValidation.error.format();
          const validatedResult = await ValidateDishes({ dish_name: dish_name2, price: price2, description: description2, ingredients: ingredients2 });
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json(validatedResult);
        }
        const dish_id = request.params.id;
        const dish = await knex4("restaurant").where({ id: dish_id }).first();
        if (!dish) {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("O prato n\xE3o foi encontrado.");
        }
        if (dish_name.length !== 0) {
          dish.dish_name = dish_name;
        }
        if (category.length !== 0) {
          dish.category = category;
        }
        if (price.length !== 0) {
          dish.price = price;
        }
        if (description.length !== 0) {
          dish.description = description;
        }
        await knex4("ingredients").where({ dish_id }).delete();
        const ingredientsInsert = ingredients.map((name) => {
          return {
            dish_id,
            admin_id,
            name
          };
        });
        await knex4("ingredients").insert(ingredientsInsert);
        const correctPrice = Number(dish.price.replace(/[^\d.,]/g, "").replace(",", "."));
        await knex4("restaurant").where({ id: dish_id }).update({
          dish_name: dish.dish_name,
          category: dish.category,
          price: correctPrice,
          description: dish.description
        }).update("updated_at", knex4.fn.now());
        return response.status(import_http_status_codes4.StatusCodes.OK).json("Prato editado com sucesso.");
      }
      async show(request, response) {
        const { id } = request.params;
        const dish = await knex4("restaurant").where({ id }).first();
        const ingredients = await knex4("ingredients").where({ dish_id: id }).orderBy("name");
        if (!dish) {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("O prato n\xE3o foi encontrado.");
        }
        return response.status(import_http_status_codes4.StatusCodes.OK).json({
          ...dish,
          ingredients
        });
      }
      async delete(request, response) {
        const { id } = request.params;
        const isAdmin = import_zod2.z.coerce.boolean().parse(request.admin.isAdmin);
        if (!isAdmin) {
          return response.status(import_http_status_codes4.StatusCodes.UNAUTHORIZED).json("Voc\xEA n\xE3o tem permiss\xE3o para deletar pratos");
        }
        await knex4("restaurant").where({ id }).delete();
        return response.status(import_http_status_codes4.StatusCodes.OK).json("Prato exclu\xEDdo com sucesso.");
      }
      async index(request, response) {
        const { name, ingredients } = request.query;
        let dishes = [];
        if (typeof name === "string") {
          const filterDishes = name.split(",").map((dish) => dish.trim());
          dishes = await knex4("restaurant").whereLike("dish_name", `%${filterDishes}%`).orderBy("restaurant.dish_name");
        }
        if (dishes.length === 0) {
          if (typeof ingredients === "string") {
            const filterIngredients = ingredients.split(",").map((ingredient) => ingredient.trim());
            dishes = await knex4("ingredients").select([
              "restaurant.id",
              "restaurant.dish_name",
              "restaurant.image",
              "restaurant.category",
              "restaurant.price",
              "restaurant.description"
            ]).whereIn("name", filterIngredients).innerJoin("restaurant", "restaurant.id", "ingredients.dish_id").orderBy("restaurant.dish_name");
          }
        }
        const filteredDishes = dishes.filter((dish, index, self) => {
          return index === self.findIndex((i) => i.id === dish.id);
        });
        const adminIngredients = await knex4("ingredients");
        const dishesWithIngredients = filteredDishes.map((dish) => {
          const dishIngredients = adminIngredients.filter((ingredient) => ingredient.dish_id === dish.id);
          return {
            ...dish,
            ingredients: dishIngredients
          };
        });
        return response.status(import_http_status_codes4.StatusCodes.OK).json(dishesWithIngredients);
      }
    };
    module2.exports = RestaurantControllers2;
  }
});

// src/configs/upload.ts
var require_upload = __commonJS({
  "src/configs/upload.ts"(exports, module2) {
    "use strict";
    var import_multer2 = __toESM(require("multer"));
    var import_crypto = __toESM(require("crypto"));
    var path2 = require("path");
    var TMP_FOLDER = path2.resolve(__dirname, "..", "tmp");
    var UPLOADS_FOLDER = path2.resolve(TMP_FOLDER, "uploads");
    var MULTER = {
      storage: import_multer2.default.diskStorage({
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
  "src/providers/DiskStorage.ts"(exports, module2) {
    "use strict";
    var fs = require("fs");
    var path2 = require("path");
    var uploadConfig2 = require_upload();
    var DiskStorage = class {
      async saveFile(file) {
        await fs.promises.rename(
          path2.resolve(uploadConfig2.TMP_FOLDER, file),
          path2.resolve(uploadConfig2.UPLOADS_FOLDER, file)
        );
        return file;
      }
      async deleteFile(file) {
        const filePath = path2.resolve(uploadConfig2.UPLOADS_FOLDER, file);
        try {
          await fs.promises.stat(filePath);
        } catch {
          return;
        }
        await fs.promises.unlink(filePath);
      }
    };
    module2.exports = DiskStorage;
  }
});

// src/controllers/RestaurantImageController.ts
var require_RestaurantImageController = __commonJS({
  "src/controllers/RestaurantImageController.ts"(exports, module2) {
    "use strict";
    var import_http_status_codes4 = require("http-status-codes");
    var knex4 = require_knex();
    var DiskStorage = require_DiskStorage();
    var RestaurantImageController2 = class {
      async update(request, response) {
        const { dish_id } = request.body;
        const imageFileName = request.file?.filename;
        if (!imageFileName) {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Imagem n\xE3o encontrada.");
        }
        const diskStorage = new DiskStorage();
        const dish = await knex4("restaurant").where({ id: dish_id }).first();
        if (!dish) {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Prato n\xE3o encontrado.");
        }
        if (dish.image) {
          await diskStorage.deleteFile(dish.image);
        }
        const filename = await diskStorage.saveFile(imageFileName);
        dish.image = filename;
        await knex4("restaurant").update(dish).where({ id: dish_id });
        return response.status(import_http_status_codes4.StatusCodes.OK).json(dish);
      }
    };
    module2.exports = RestaurantImageController2;
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
    var import_http_status_codes4 = require("http-status-codes");
    var { verify } = require("jsonwebtoken");
    var authConfig2 = require_auth();
    function ensureAuthenticared6(request, response, next) {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("JWT Token n\xE3o informado.");
      }
      const [, token] = authHeader.split(" ");
      try {
        const { sub: admin_id, jti: isAdmin } = verify(token, authConfig2.jwt.secret);
        request.admin = {
          id: Number(admin_id),
          isAdmin: Number(isAdmin)
        };
        return next();
      } catch {
        return response.status(import_http_status_codes4.StatusCodes.FORBIDDEN).json("JWT Token inv\xE1lido.");
      }
    }
    module2.exports = ensureAuthenticared6;
  }
});

// src/controllers/IngredientsController.ts
var require_IngredientsController = __commonJS({
  "src/controllers/IngredientsController.ts"(exports, module2) {
    "use strict";
    var knex4 = require_knex();
    var TagsController = class {
      async index(request, response) {
        const { dish_id } = request.query;
        const ingredients = await knex4("ingredients").where({ dish_id });
        return response.json(ingredients);
      }
    };
    module2.exports = TagsController;
  }
});

// src/controllers/FavoritesControllers.ts
var require_FavoritesControllers = __commonJS({
  "src/controllers/FavoritesControllers.ts"(exports, module2) {
    "use strict";
    var import_http_status_codes4 = require("http-status-codes");
    var import_zod2 = require("zod");
    var knex4 = require_knex();
    var FavoritesControllers2 = class {
      async addDish(request, response) {
        const { dish_id, user_id } = request.body;
        const isAdmin = import_zod2.z.coerce.boolean().parse(request.admin.isAdmin);
        const dish = await knex4("restaurant").where({ id: dish_id }).first();
        if (!dish) {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Esse prato n\xE3o existe.");
        }
        const checkIfUserExist = await knex4("users").where({ id: user_id }).first();
        const checkIfAdminExist = await knex4("admins").where({ id: user_id }).first();
        if (!checkIfUserExist && !checkIfAdminExist) {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Esse usu\xE1rio n\xE3o existe.");
        }
        const newFavorite = {
          dish_id: dish.id,
          user_id: checkIfUserExist.id,
          isAdmin: isAdmin ? 1 : 0
        };
        await knex4("favorites").insert(newFavorite);
        return response.status(import_http_status_codes4.StatusCodes.OK).json("Favoritado!");
      }
      async removeFavorites(request, response) {
        const { dish_id } = request.params;
        await knex4("favorites").where({ dish_id }).delete();
        return response.status(import_http_status_codes4.StatusCodes.OK).json("Desfavoritado.");
      }
      async show(request, response) {
        const { dish_id } = request.params;
        const user_id = request.admin.id;
        const isAdmin = import_zod2.z.coerce.boolean().parse(request.admin.isAdmin);
        let favorite = await knex4("favorites").where({ user_id }).where({ isAdmin }).where({ dish_id }).first();
        if (isAdmin) {
          favorite = await knex4("favorites").where({ isAdmin }).where({ dish_id }).first();
        }
        return response.json(favorite);
      }
      async index(request, response) {
        const { user_id } = request.query;
        const isAdmin = import_zod2.z.coerce.boolean().parse(request.admin.isAdmin);
        let favorites = await knex4("favorites").where({ user_id });
        if (isAdmin) {
          favorites = await knex4("favorites").where({ isAdmin }).where({ user_id });
        }
        return response.json(favorites);
      }
    };
    module2.exports = FavoritesControllers2;
  }
});

// src/controllers/OrdersControllers.ts
var require_OrdersControllers = __commonJS({
  "src/controllers/OrdersControllers.ts"(exports, module2) {
    "use strict";
    var import_http_status_codes4 = require("http-status-codes");
    var knex4 = require_knex();
    var OrdersControllers2 = class {
      async finalizeOrder(request, response) {
        const user_id = request.admin.id;
        const openOrder = await knex4("orders").where({ user_id }).where({ status: "open" }).first();
        const [payment_id] = await knex4("payment").insert({
          status: "pending",
          user_id,
          order_id: openOrder.id
        });
        await knex4("orders").where({ id: openOrder.id }).update({
          status: "pending",
          payment_id
        }).update("updated_at", knex4.fn.now());
        await knex4("orders").insert({
          status: "open",
          payment_id: null,
          user_id
        });
        return response.status(import_http_status_codes4.StatusCodes.OK).json("Pedido feito, aguardando confirma\xE7\xE3o do pagamento.");
      }
      async updateStatus(request, response) {
        const { id } = request.params;
        const order = await knex4("orders").where({ id }).first();
        if (order.status === "delivered") {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Esse pedido j\xE1 foi finalizado.");
        }
        if (order.status === "preparing") {
          await knex4("orders").where({ id }).update({
            status: "delivered"
          }).update("updated_at", knex4.fn.now());
        } else {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("O pagamento ainda n\xE3o foi confirmado.");
        }
        return response.status(import_http_status_codes4.StatusCodes.OK).json("O estatos do pedido foi alterado.");
      }
      async showOrders(request, response) {
        const user_id = request.admin.id;
        let orders = await knex4("orders").where({ user_id });
        if (request.admin.isAdmin === 1) {
          orders = await knex4("orders");
        }
        const items = await knex4("order-items");
        const ordersWithItems = orders.map((order) => {
          const dishes = items.filter((item) => item.order_id === order.id);
          return {
            ...order,
            dishes
          };
        });
        return response.status(import_http_status_codes4.StatusCodes.OK).json(ordersWithItems);
      }
      async index(request, response) {
        const { id } = request.params;
        const user_id = request.admin.id;
        let checkOrder = await knex4("orders").where({ user_id }).where({ id }).first();
        if (request.admin.isAdmin) {
          checkOrder = await knex4("orders").where({ id }).first();
        }
        if (!checkOrder) {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("A ordem n\xE3o existe");
        }
        const items = await knex4("order-items");
        const dishes = items.filter((item) => item.order_id === checkOrder.id);
        const orderWithItems = {
          ...checkOrder,
          dishes
        };
        return response.status(import_http_status_codes4.StatusCodes.OK).json(orderWithItems);
      }
    };
    module2.exports = OrdersControllers2;
  }
});

// src/controllers/OrderItemsController.ts
var require_OrderItemsController = __commonJS({
  "src/controllers/OrderItemsController.ts"(exports, module2) {
    "use strict";
    var import_http_status_codes4 = require("http-status-codes");
    var knex4 = require_knex();
    var OrderItemsController2 = class {
      async addItem(request, response) {
        const { dish_id, quantity } = request.body;
        const user_id = request.admin.id;
        const isAdmin = request.admin.isAdmin;
        if (isAdmin === 1) {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Administradores n\xE3o podem fazer pedidos.");
        }
        const dish = await knex4("restaurant").where({ id: dish_id }).first();
        if (!dish) {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Prato n\xE3o encontrado.");
        }
        const openOrder = await knex4("orders").where({ user_id }).where({ status: "open" }).first();
        const checkDishOnOrder = await knex4("order-items").where({ order_id: openOrder.id }).where({ dish_id }).first();
        if (checkDishOnOrder) {
          await knex4("order-items").where({ order_id: openOrder.id }).where({ dish_id }).update({
            quantity,
            price: dish.price
          }).update("updated_at", knex4.fn.now());
        } else {
          await knex4("order-items").insert({
            dish_id,
            quantity,
            price: dish.price,
            order_id: openOrder.id
          });
        }
        await knex4("orders").where({ id: openOrder.id }).update("updated_at", knex4.fn.now());
        return response.status(import_http_status_codes4.StatusCodes.CREATED).json("Item adicionado.");
      }
      async delete(request, response) {
        const { dish_id } = request.query;
        const user_id = request.admin?.id;
        const isAdmin = request.admin.isAdmin;
        if (isAdmin === 1) {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Administradores n\xE3o deletar itens dos usu\xE1rios.");
        }
        const openOrder = await knex4("orders").where({ user_id }).where({ status: "open" }).first();
        await knex4("order-items").where({ order_id: openOrder.id }).where({ dish_id }).delete();
        await knex4("orders").where({ id: openOrder.id }).update("updated_at", knex4.fn.now());
        return response.status(import_http_status_codes4.StatusCodes.OK).json("Item exclu\xEDdo do pedido.");
      }
      async showItems(request, response) {
        const user_id = request.admin.id;
        const openOrder = await knex4("orders").where({ user_id }).where({ status: "open" }).first();
        const checkDishOnOrder = await knex4("order-items").where({ order_id: openOrder.id });
        return response.status(import_http_status_codes4.StatusCodes.OK).json(checkDishOnOrder);
      }
    };
    module2.exports = OrderItemsController2;
  }
});

// src/controllers/PaymentController.ts
var require_PaymentController = __commonJS({
  "src/controllers/PaymentController.ts"(exports, module2) {
    "use strict";
    var import_http_status_codes4 = require("http-status-codes");
    var knex4 = require_knex();
    var PaymentController2 = class {
      async update(request, response) {
        const { id, status } = request.body;
        const order_id = Number(id);
        const order = await knex4("orders").where({ id: order_id }).first();
        if (order.status === "open") {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Esse pedido ainda est\xE1 aberto.");
        }
        if (order.status === "delivered") {
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Esse pedido j\xE1 foi finalizado.");
        }
        if (order.status === "preparing" && status === "canceled" || order.status === "pending" && status === "canceled") {
          await knex4("payment").where({ user_id: order.user_id }).where({ order_id }).update({
            status: "canceled"
          }).update("updated_at", knex4.fn.now());
          await knex4("orders").where({ id: order_id }).update({
            status: "canceled"
          }).update("updated_at", knex4.fn.now());
          return response.status(import_http_status_codes4.StatusCodes.BAD_REQUEST).json("Problema no pagamento, pedido cancelado.");
        }
        if (status === "preparing") {
          await knex4("payment").where({ user_id: order.user_id }).where({ order_id }).update({
            status: "paid"
          }).update("updated_at", knex4.fn.now());
          await knex4("orders").where({ id: order_id }).update({
            status
          }).update("updated_at", knex4.fn.now());
          return response.status(import_http_status_codes4.StatusCodes.OK).json("Pagamento confirmado.");
        }
      }
    };
    module2.exports = PaymentController2;
  }
});

// src/routes/index.ts
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
var import_express10 = require("express");

// src/routes/users.routes.ts
var import_express = require("express");

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
var UsersControllers = class {
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
        return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json(name2?._errors[0]);
      }
      if (email2) {
        return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json(email2?._errors[0]);
      }
      if (password2) {
        return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json(password2?._errors[0]);
      }
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json();
    }
    const pssLenght = String(password).length;
    const checkIfUserExist = await knex("users").where({ email }).first();
    const checkIfADminExist = await knex("admins").where({ email }).first();
    if (checkIfUserExist) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("E-mail j\xE1 cadastrado.");
    }
    if (checkIfADminExist) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("E-mail j\xE1 cadastrado.");
    }
    const hashedPasword = await (0, import_bcryptjs.hash)(password, 8);
    const [id] = await knex("users").insert({
      name,
      email,
      password: hashedPasword
    });
    await knex("orders").insert({
      status: "open",
      payment_id: null,
      user_id: id
    });
    return response.status(import_http_status_codes.StatusCodes.CREATED).json("Usu\xE1rio cadastrado com sucesso.");
  }
};

// src/routes/users.routes.ts
var usersRoutes = (0, import_express.Router)();
var usersControllers = new UsersControllers();
usersRoutes.post("/", usersControllers.create);
var users_routes_default = usersRoutes;

// src/routes/admins.routes.ts
var import_express2 = require("express");

// src/controllers/AdminsControllers.ts
var import_bcryptjs2 = require("bcryptjs");
var import_http_status_codes2 = require("http-status-codes");
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

// src/routes/admins.routes.ts
var adminsRoutes = (0, import_express2.Router)();
var adminsControllers = new AdminsControllers();
adminsRoutes.post("/", adminsControllers.create);
var admins_routes_default = adminsRoutes;

// src/routes/restaurant.routes.ts
var import_express3 = require("express");
var import_multer = __toESM(require("multer"));
var RestaurantControllers = require_RestaurantControllers();
var RestaurantImageController = require_RestaurantImageController();
var ensureAuthenticared = require_ensureAuthenticared();
var uploadConfig = require_upload();
var restaurantRoutes = (0, import_express3.Router)();
var upload = (0, import_multer.default)(uploadConfig.MULTER);
var restaurantControllers = new RestaurantControllers();
var restaurantImageController = new RestaurantImageController();
restaurantRoutes.use(ensureAuthenticared);
restaurantRoutes.post("/", restaurantControllers.createDish);
restaurantRoutes.put("/:id", restaurantControllers.update);
restaurantRoutes.delete("/:id", restaurantControllers.delete);
restaurantRoutes.get("/:id", restaurantControllers.show);
restaurantRoutes.get("/", restaurantControllers.index);
restaurantRoutes.patch("/image", ensureAuthenticared, upload.single("image"), restaurantImageController.update);
var restaurant_routes_default = restaurantRoutes;

// src/routes/sessions.routes.ts
var import_express4 = require("express");

// src/controllers/SessionsController.ts
var import_bcryptjs3 = require("bcryptjs");
var import_http_status_codes3 = require("http-status-codes");
var { sign } = require("jsonwebtoken");
var knex3 = require_knex();
var authConfig = require_auth();
var SessionsController = class {
  async create(request, response) {
    const { email, password } = request.body;
    const user = await knex3("users").where({ email }).first();
    const admin = await knex3("admins").where({ email }).first();
    if (!user && !admin) {
      return response.status(import_http_status_codes3.StatusCodes.BAD_REQUEST).json("E-mail e/ou senha incorretos.");
    }
    if (user) {
      const checkPassword = await (0, import_bcryptjs3.compare)(password, user.password);
      if (!checkPassword) {
        return response.status(import_http_status_codes3.StatusCodes.BAD_REQUEST).json("E-mail e/ou senha incorretos.");
      }
    }
    if (admin) {
      const checkPassword = await (0, import_bcryptjs3.compare)(password, admin.password);
      if (!checkPassword) {
        return response.status(import_http_status_codes3.StatusCodes.BAD_REQUEST).json("E-mail e/ou senha incorretos.");
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
var sessionsRoutes = (0, import_express4.Router)();
var sessionsController = new SessionsController();
sessionsRoutes.post("/", sessionsController.create);
var sessions_routes_default = sessionsRoutes;

// src/routes/ingredients.routes.ts
var import_express5 = require("express");
var IngredientsController = require_IngredientsController();
var ensureAuthenticated = require_ensureAuthenticared();
var restaurantRoutes2 = (0, import_express5.Router)();
var ingredientsController = new IngredientsController();
restaurantRoutes2.get("/", ensureAuthenticated, ingredientsController.index);
var ingredients_routes_default = restaurantRoutes2;

// src/routes/favorites.routes.ts
var import_express6 = require("express");
var FavoritesControllers = require_FavoritesControllers();
var ensureAuthenticared2 = require_ensureAuthenticared();
var favoritesRoutes = (0, import_express6.Router)();
var favoritesControllers = new FavoritesControllers();
favoritesRoutes.use(ensureAuthenticared2);
favoritesRoutes.post("/", favoritesControllers.addDish);
favoritesRoutes.delete("/:dish_id", favoritesControllers.removeFavorites);
favoritesRoutes.get("/:dish_id", favoritesControllers.show);
favoritesRoutes.get("/", favoritesControllers.index);
var favorites_routes_default = favoritesRoutes;

// src/routes/orders.routes.ts
var import_express7 = require("express");
var OrdersControllers = require_OrdersControllers();
var ensureAuthenticared3 = require_ensureAuthenticared();
var ordersRoutes = (0, import_express7.Router)();
var ordersControllers = new OrdersControllers();
ordersRoutes.use(ensureAuthenticared3);
ordersRoutes.put("/", ordersControllers.finalizeOrder);
ordersRoutes.put("/:id", ordersControllers.updateStatus);
ordersRoutes.get("/:id", ordersControllers.index);
ordersRoutes.get("/", ordersControllers.showOrders);
var orders_routes_default = ordersRoutes;

// src/routes/orderItems.routes.ts
var import_express8 = require("express");
var OrderItemsController = require_OrderItemsController();
var ensureAuthenticared4 = require_ensureAuthenticared();
var orderItemsRoutes = (0, import_express8.Router)();
var orderItemsController = new OrderItemsController();
orderItemsRoutes.use(ensureAuthenticared4);
orderItemsRoutes.post("/", orderItemsController.addItem);
orderItemsRoutes.delete("/", orderItemsController.delete);
orderItemsRoutes.get("/", orderItemsController.showItems);
var orderItems_routes_default = orderItemsRoutes;

// src/routes/payment.routes.ts
var import_express9 = require("express");
var PaymentController = require_PaymentController();
var ensureAuthenticared5 = require_ensureAuthenticared();
var paymentRoute = (0, import_express9.Router)();
var paymentController = new PaymentController();
paymentRoute.use(ensureAuthenticared5);
paymentRoute.put("/", paymentController.update);
var payment_routes_default = paymentRoute;

// src/routes/index.ts
var routes = (0, import_express10.Router)();
routes.use("/users", users_routes_default);
routes.use("/sessions", sessions_routes_default);
routes.use("/admins", admins_routes_default);
routes.use("/restaurant", restaurant_routes_default);
routes.use("/ingredients", ingredients_routes_default);
routes.use("/favorites", favorites_routes_default);
routes.use("/orders", orders_routes_default);
routes.use("/orderitems", orderItems_routes_default);
routes.use("/payment", payment_routes_default);
var routes_default = routes;
