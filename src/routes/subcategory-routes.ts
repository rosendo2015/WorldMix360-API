import { Router } from "express";
import { SubcategoryController } from "../controllers/subcategory-controller";

const subcategoryRouter = Router();
const subcategoryController = new SubcategoryController();

subcategoryRouter.post("/", subcategoryController.create);
subcategoryRouter.get("/", subcategoryController.list);
subcategoryRouter.get("/:id", subcategoryController.get);
subcategoryRouter.put("/:id", subcategoryController.update);
subcategoryRouter.delete("/:id", subcategoryController.delete);

export { subcategoryRouter as subcategoryRoutes };
