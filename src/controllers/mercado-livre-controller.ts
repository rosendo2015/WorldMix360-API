import type { Request, Response } from "express";
import { z } from "zod";

import { mercadoLivreConfig } from "@/configs/mercado-livre";

import {
  analyzeMercadoLivreExternalLink,
  connectMercadoLivre,
  getMercadoLivreAuthorizationUrl,
  getMercadoLivreProducts,
  importMercadoLivreProduct,
  syncMercadoLivreProducts,
} from "@/services/mercado-livre-service";

const imageSchema = z.object({
  imageUrl: z.string().url(),
  sortOrder: z.number().int().min(0).optional(),
});

const importProductSchema = z.object({
  affiliateUrl: z.string().url(),
  externalLink: z.string().url(),

  catalogProductId: z.string().regex(/^MLB\d+$/i),
  itemId: z.string().regex(/^MLB\d+$/i),
  sellerId: z.string().regex(/^\d+$/),

  subcategoryId: z.string().uuid(),

  title: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),

  imageUrl: z.string().url().optional(),
  images: z.array(imageSchema).optional(),

  price: z.number().nonnegative().optional(),
  originalPrice: z.number().nonnegative().optional(),
  currency: z.string().min(1).max(10).optional(),

  rating: z.number().min(0).max(5).optional(),
  reviewsCount: z.number().int().min(0).optional(),

  featured: z.boolean().optional(),
  available: z.boolean().optional(),
  active: z.boolean().optional(),

  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export class MercadoLivreController {
  authorize(_request: Request, response: Response) {
    return response.json({
      authorizationUrl: getMercadoLivreAuthorizationUrl(),
    });
  }

  async callback(request: Request, response: Response) {
    const query = z
      .object({
        code: z.string(),
        state: z.string(),
      })
      .parse(request.query);

    await connectMercadoLivre(query.code, query.state);

    return response.redirect(
      `${mercadoLivreConfig.webUrl}/?mercadoLivre=connected`,
    );
  }

  async products(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().optional(),
      })
      .parse(request.query);

    return response.json({
      products: await getMercadoLivreProducts(query.search),
    });
  }

  async analyzeProduct(request: Request, response: Response) {
    const body = z
      .object({
        externalLink: z.string().url(),
      })
      .parse(request.body);

    const result = await analyzeMercadoLivreExternalLink(body.externalLink);

    return response.json(result);
  }

  async importProduct(request: Request, response: Response) {
    const body = importProductSchema.parse(request.body);

    const product = await importMercadoLivreProduct(body);

    return response.status(201).json({
      message: "Produto do Mercado Livre importado com sucesso",
      product,
    });
  }

  async sync(_request: Request, response: Response) {
    const products = await syncMercadoLivreProducts();

    return response.json({
      message: "Produtos do Mercado Livre sincronizados com sucesso",
      products,
    });
  }
}
