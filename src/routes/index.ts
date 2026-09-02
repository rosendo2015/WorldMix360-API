import { Router } from "express";
import { mercadoLivreRoutes } from "./mercado-livre-routes";
import { productRoutes } from "./product-routes";
import { sessionsRoutes } from "./sessions-routes";
import { userRoutes } from "./user-routes";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/session", sessionsRoutes);
routes.use("/mercado-livre", mercadoLivreRoutes);
routes.use("/products", productRoutes);

export { routes };
