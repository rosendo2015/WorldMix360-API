import { Router } from "express";

import { ProductsController } from "@/controllers/products-controller";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const productRoutes = Router();

const productsController = new ProductsController();

// Públicas

productRoutes.get("/", productsController.index);

productRoutes.get(
  "/admin",
  ensureAuthenticated,
  ensureAdmin,
  productsController.indexAdmin,
);

productRoutes.get(
  "/id/:id",
  ensureAuthenticated,
  ensureAdmin,
  productsController.showById,
);

productRoutes.get("/:slug", productsController.show);

// Administrativas

productRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  productsController.create,
);

productRoutes.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  productsController.update,
);

productRoutes.patch(
  "/:id/status",
  ensureAuthenticated,
  ensureAdmin,
  productsController.updateStatus,
);

productRoutes.post(
  "/sync",
  ensureAuthenticated,
  ensureAdmin,
  productsController.sync,
);

export { productRoutes };
