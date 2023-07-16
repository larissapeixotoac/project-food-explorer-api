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

// src/controllers/RestaurantControllers.ts
var import_zod = require("zod");
var import_http_status_codes = require("http-status-codes");
var knex = require_knex();
var createDish = import_zod.z.object({
  dish_name: import_zod.z.string().nonempty("O campo do nome \xE9 obrigat\xF3rio."),
  price: import_zod.z.string().nonempty("O campo do pre\xE7o \xE9 obrigat\xF3rio"),
  description: import_zod.z.string(),
  ingredients: import_zod.z.string().array().nonempty("\xC9 necess\xE1rio que o prato tenha pelo menos um ingrediente.")
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
var RestaurantControllers = class {
  async createDish(request, response) {
    const { dish_name, category, price, description, ingredients } = request.body;
    const admin_id = request.admin.id;
    const isAdmin = import_zod.z.coerce.boolean().parse(request.admin.isAdmin);
    const resultValidation = createDish.safeParse({
      dish_name,
      price,
      description,
      ingredients
    });
    if (!isAdmin) {
      return response.status(import_http_status_codes.StatusCodes.UNAUTHORIZED).json("Voc\xEA n\xE3o tem permiss\xE3o para criar pratos");
    }
    let validatedResult;
    if (!resultValidation.success) {
      const { dish_name: dish_name2, price: price2, description: description2, ingredients: ingredients2 } = resultValidation.error.format();
      validatedResult = await ValidateDishes({ dish_name: dish_name2, price: price2, description: description2, ingredients: ingredients2 });
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json(validatedResult);
    }
    const checkIfDishExist = await knex("restaurant").where({ dish_name }).first();
    if (checkIfDishExist) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("Este prato j\xE1 est\xE1 cadastrado.");
    }
    const correctPrice = Number(price.replace(/[^\d.,]/g, "").replace(",", "."));
    const [dish_id] = await knex("restaurant").insert({
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
    await knex("ingredients").insert(ingredientsInsert);
    return response.status(import_http_status_codes.StatusCodes.OK).json({ message: "Prato adicionado com sucesso.", dish_id });
  }
  async update(request, response) {
    const { dish_name, category, price, description, ingredients } = request.body;
    const admin_id = request.admin.id;
    const isAdmin = import_zod.z.coerce.boolean().parse(request.admin.isAdmin);
    if (!isAdmin) {
      return response.status(import_http_status_codes.StatusCodes.FORBIDDEN).json("Voc\xEA n\xE3o tem permiss\xE3o para editar pratos");
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
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json(validatedResult);
    }
    const dish_id = request.params.id;
    const dish = await knex("restaurant").where({ id: dish_id }).first();
    if (!dish) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("O prato n\xE3o foi encontrado.");
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
    await knex("ingredients").where({ dish_id }).delete();
    const ingredientsInsert = ingredients.map((name) => {
      return {
        dish_id,
        admin_id,
        name
      };
    });
    await knex("ingredients").insert(ingredientsInsert);
    const correctPrice = Number(dish.price.replace(/[^\d.,]/g, "").replace(",", "."));
    await knex("restaurant").where({ id: dish_id }).update({
      dish_name: dish.dish_name,
      category: dish.category,
      price: correctPrice,
      description: dish.description
    }).update("updated_at", knex.fn.now());
    return response.status(import_http_status_codes.StatusCodes.OK).json("Prato editado com sucesso.");
  }
  async show(request, response) {
    const { id } = request.params;
    const dish = await knex("restaurant").where({ id }).first();
    const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");
    if (!dish) {
      return response.status(import_http_status_codes.StatusCodes.BAD_REQUEST).json("O prato n\xE3o foi encontrado.");
    }
    return response.status(import_http_status_codes.StatusCodes.OK).json({
      ...dish,
      ingredients
    });
  }
  async delete(request, response) {
    const { id } = request.params;
    const isAdmin = import_zod.z.coerce.boolean().parse(request.admin.isAdmin);
    if (!isAdmin) {
      return response.status(import_http_status_codes.StatusCodes.UNAUTHORIZED).json("Voc\xEA n\xE3o tem permiss\xE3o para deletar pratos");
    }
    await knex("restaurant").where({ id }).delete();
    return response.status(import_http_status_codes.StatusCodes.OK).json("Prato exclu\xEDdo com sucesso.");
  }
  async index(request, response) {
    const { name, ingredients } = request.query;
    let dishes = [];
    if (typeof name === "string") {
      const filterDishes = name.split(",").map((dish) => dish.trim());
      dishes = await knex("restaurant").whereLike("dish_name", `%${filterDishes}%`).orderBy("restaurant.dish_name");
    }
    if (dishes.length === 0) {
      if (typeof ingredients === "string") {
        const filterIngredients = ingredients.split(",").map((ingredient) => ingredient.trim());
        dishes = await knex("ingredients").select([
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
    const adminIngredients = await knex("ingredients");
    const dishesWithIngredients = filteredDishes.map((dish) => {
      const dishIngredients = adminIngredients.filter((ingredient) => ingredient.dish_id === dish.id);
      return {
        ...dish,
        ingredients: dishIngredients
      };
    });
    return response.status(import_http_status_codes.StatusCodes.OK).json(dishesWithIngredients);
  }
};
module.exports = RestaurantControllers;
