// src/routes/category-routes.ts
import { Router } from "express";
import { CategoryController } from "../controllers/category-controller";

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.post("/", categoryController.create);
categoryRouter.get("/", categoryController.list);
categoryRouter.get("/:id", categoryController.get);
categoryRouter.put("/:id", categoryController.update);
categoryRouter.delete("/:id", categoryController.delete);

export { categoryRouter as categoryRoutes };
