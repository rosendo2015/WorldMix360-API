import { Router } from "express";

import { MercadoLivreController } from "@/controllers/mercado-livre-controller";
import { ensureAdmin } from "@/middleware/ensure-admin";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { analyzeMercadoLivrePublicPage } from "@/services/mercado-livre/mercado-livre.service";
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

/*
 * Atualiza a oferta vinculada a um produto já existente.
 *
 * Importante:
 * - não cria Product;
 * - não cria MarketplaceProduct;
 * - mantém os mesmos IDs;
 * - atualiza apenas a referência/oferta do Mercado Livre.
 */
mercadoLivreRoutes.put(
  "/products/:productId/offer",
  ensureAuthenticated,
  ensureAdmin,
  controller.updateProductOffer.bind(controller),
);

mercadoLivreRoutes.post(
  "/products/analyze-page",
  ensureAuthenticated,
  ensureAdmin,
  async (request, response) => {
    try {
      const { url } = request.body;

      if (typeof url !== "string" || !url.trim()) {
        return response.status(400).json({
          message: "Informe a URL do produto do Mercado Livre.",
        });
      }

      const result = await analyzeMercadoLivrePublicPage(url);

      return response.status(200).json(result);
    } catch (error) {
      console.error("Erro ao analisar página pública do Mercado Livre:", error);

      return response.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao analisar página pública do Mercado Livre.",
      });
    }
  },
);

mercadoLivreRoutes.post(
  "/sync",
  ensureAuthenticated,
  ensureAdmin,
  controller.sync.bind(controller),
);

export { mercadoLivreRoutes };
