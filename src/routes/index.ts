/* src/routes/index.ts */

import { Router } from "express";
import { blogCategoriesRoutes } from "@/routes/blog-categories-routes";
import { searchRouter } from "@/routes/search-routes";
import { blogRoutes } from "./blog-routes";
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

routes.use("/search", searchRouter);

routes.use("/blog/categories", blogCategoriesRoutes);

routes.use("/blog", blogRoutes);

export { routes };
