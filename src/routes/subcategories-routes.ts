import { Router } from "express";

import { SubcategoriesController } from "../controllers/subcategories-controller";
import { ensureAdmin } from "../middleware/ensure-admin";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";

const subcategoriesRouter = Router();

const subcategoriesController = new SubcategoriesController();

// Públicas para leitura
subcategoriesRouter.get("/", subcategoriesController.list);
subcategoriesRouter.get("/:id", subcategoriesController.get);

// Administrativas
subcategoriesRouter.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  subcategoriesController.create,
);

subcategoriesRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  subcategoriesController.update,
);

subcategoriesRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  subcategoriesController.delete,
);

export { subcategoriesRouter as subcategoriesRoutes };
