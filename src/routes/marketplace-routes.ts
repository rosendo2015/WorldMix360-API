import { Router } from "express";

import { MarketplaceController } from "../controllers/marketplace-controller";
import { ensureAdmin } from "../middleware/ensure-admin";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";

const marketplaceRouter = Router();

const marketplaceController = new MarketplaceController();

// Públicas para leitura
marketplaceRouter.get("/", marketplaceController.list);
marketplaceRouter.get("/:id", marketplaceController.get);

// Administrativas
marketplaceRouter.post(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  marketplaceController.create,
);

marketplaceRouter.put(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  marketplaceController.update,
);

marketplaceRouter.delete(
  "/:id",
  ensureAuthenticated,
  ensureAdmin,
  marketplaceController.delete,
);

export { marketplaceRouter as marketplaceRoutes };
