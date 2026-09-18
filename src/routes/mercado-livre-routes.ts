import { Router } from "express";

import { MercadoLivreController } from "@/controllers/mercado-livre-controller";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { findCatalogOfferByItem } from "@/services/mercado-livre-service";

const mercadoLivreRoutes = Router();

const controller = new MercadoLivreController();

mercadoLivreRoutes.get("/authorize", controller.authorize.bind(controller));

mercadoLivreRoutes.get("/callback", controller.callback.bind(controller));

mercadoLivreRoutes.get("/products", controller.products.bind(controller));

mercadoLivreRoutes.get(
  "/products/check-offer",
  ensureAuthenticated,
  ensureAdmin,
  async (request, response) => {
    try {
      const { catalogProductId, sellerId, itemId } = request.query;

      if (
        typeof catalogProductId !== "string" ||
        typeof sellerId !== "string" ||
        typeof itemId !== "string"
      ) {
        return response.status(400).json({
          message:
            "Informe catalogProductId, sellerId e itemId como parâmetros da consulta.",
        });
      }

      const result = await findCatalogOfferByItem(
        catalogProductId,
        sellerId,
        itemId,
      );

      return response.status(200).json({
        catalogProductId,
        sellerId,
        itemId,
        ...result,
      });
    } catch (error) {
      console.error("Erro ao verificar oferta do Mercado Livre:", error);

      return response.status(500).json({
        message: "Erro ao verificar oferta do Mercado Livre.",
      });
    }
  },
);

mercadoLivreRoutes.post(
  "/products/analyze",
  ensureAuthenticated,
  ensureAdmin,
  controller.analyzeProduct.bind(controller),
);

mercadoLivreRoutes.post(
  "/products/import",
  ensureAuthenticated,
  ensureAdmin,
  controller.importProduct.bind(controller),
);

mercadoLivreRoutes.post(
  "/sync",
  ensureAuthenticated,
  ensureAdmin,
  controller.sync.bind(controller),
);

export { mercadoLivreRoutes };
