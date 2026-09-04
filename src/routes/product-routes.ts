import { Router } from "express";
import { ProductsController } from "@/controllers/products-controller";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";

const productRoutes = Router();

const controller = new ProductsController();

// Públicas
productRoutes.get("/", controller.index.bind(controller));
productRoutes.get("/:slug", controller.show.bind(controller));

// Administrativas
productRoutes.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  controller.create.bind(controller),
);

productRoutes.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  controller.update.bind(controller),
);

productRoutes.patch(
  "/:id/status",
  ensureAuthenticated,
  ensureAdmin,
  controller.updateStatus.bind(controller),
);

productRoutes.post(
  "/sync",
  ensureAuthenticated,
  ensureAdmin,
  controller.sync.bind(controller),
);

export { productRoutes };
