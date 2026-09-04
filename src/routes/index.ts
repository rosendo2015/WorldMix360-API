/* src/routes/index.ts */
import { Router } from "express";
import { categoriesRoutes } from "./categories-routes";
import { marketplaceRoutes } from "./marketplace-routes";
import { mercadoLivreRoutes } from "./mercado-livre-routes";
import { productRoutes } from "./product-routes";
import { sessionsRoutes } from "./sessions-routes";
import { subcategoriesRoutes } from "./subcategories-routes";
import { userRoutes } from "./user-routes";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/session", sessionsRoutes);
routes.use("/mercado-livre", mercadoLivreRoutes);
routes.use("/products", productRoutes);
routes.use("/categories", categoriesRoutes);
routes.use("/subcategories", subcategoriesRoutes);
routes.use("/marketplaces", marketplaceRoutes);

export { routes };
