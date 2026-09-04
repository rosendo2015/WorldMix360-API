/* src/routes/index.ts */
import { Router } from "express";
import { categoryRoutes } from "./category-routes";
import { marketplaceRoutes } from "./marketplace-routes";
import { mercadoLivreRoutes } from "./mercado-livre-routes";
import { productRoutes } from "./product-routes";
import { sessionsRoutes } from "./sessions-routes";
import { subcategoryRoutes } from "./subcategory-routes";
import { userRoutes } from "./user-routes";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/session", sessionsRoutes);
routes.use("/mercado-livre", mercadoLivreRoutes);
routes.use("/products", productRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/subcategories", subcategoryRoutes);
routes.use("/marketplaces", marketplaceRoutes);

export { routes };
