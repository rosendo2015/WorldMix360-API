import { Router } from "express";
import { MarketplaceController } from "../controllers/marketplace-controller";

const marketplaceRouter = Router();
const marketplaceController = new MarketplaceController();

marketplaceRouter.post("/", marketplaceController.create);
marketplaceRouter.get("/", marketplaceController.list);
marketplaceRouter.get("/:id", marketplaceController.get);
marketplaceRouter.put("/:id", marketplaceController.update);
marketplaceRouter.delete("/:id", marketplaceController.delete);

export { marketplaceRouter as marketplaceRoutes };
