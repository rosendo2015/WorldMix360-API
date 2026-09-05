// src/routes/category-routes.ts
import { Router } from "express";

import { CategoryController } from "../controllers/categories-controllers";
import { ensureAdmin } from "../middleware/ensure-admin";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";

const categoriesRouter = Router();

const categoryController = new CategoryController();

// Públicas/autenticadas para leitura
categoriesRouter.get("/", categoryController.list);
categoriesRouter.get("/:id", categoryController.get);

// Administrativas
categoriesRouter.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.create,
);

categoriesRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.update,
);

categoriesRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  categoryController.delete,
);

export { categoriesRouter as categoriesRoutes };
