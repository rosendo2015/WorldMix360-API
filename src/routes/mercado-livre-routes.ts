import { Router } from "express";
import { MercadoLivreController } from "@/controllers/mercado-livre-controller";

const mercadoLivreRoutes = Router();
const controller = new MercadoLivreController();

mercadoLivreRoutes.get("/authorize", controller.authorize.bind(controller));
mercadoLivreRoutes.get("/callback", controller.callback.bind(controller));
mercadoLivreRoutes.get("/products", controller.products.bind(controller));

export { mercadoLivreRoutes };
