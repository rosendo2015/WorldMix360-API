// src/routes/category-routes.ts
import { Router } from "express";
import { CategoryController } from "../controllers/categories-controllers";

const categoriesRouter = Router();
const categoryController = new CategoryController();

categoriesRouter.post("/", categoryController.create);
categoriesRouter.get("/", categoryController.list);
categoriesRouter.get("/:id", categoryController.get);
categoriesRouter.put("/:id", categoryController.update);
categoriesRouter.delete("/:id", categoryController.delete);

export { categoriesRouter as categoriesRoutes };
