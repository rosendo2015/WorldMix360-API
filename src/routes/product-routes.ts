import { Router } from "express";
import { ProductsController } from "@/controllers/products-controller";

const productRoutes = Router();
const controller = new ProductsController();

productRoutes.get("/", controller.index.bind(controller));
productRoutes.post("/sync", controller.sync.bind(controller));

export { productRoutes };
