import { Router } from "express";
import { SubcategoriesController } from "../controllers/subcategories-controller";

const subcategoriesRouter = Router();
const subcategoriesController = new SubcategoriesController();

subcategoriesRouter.post("/", subcategoriesController.create);
subcategoriesRouter.get("/", subcategoriesController.list);
subcategoriesRouter.get("/:id", subcategoriesController.get);
subcategoriesRouter.put("/:id", subcategoriesController.update);
subcategoriesRouter.delete("/:id", subcategoriesController.delete);

export { subcategoriesRouter as subcategoriesRoutes };
