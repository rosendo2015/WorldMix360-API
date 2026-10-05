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
  updateMercadoLivreProductOffer,
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

  title: z.string().min(1),
  description: z.string().optional(),
  shortDescription: z.string().optional(),

  imageUrl: z.string().url().optional(),
  images: z.array(imageSchema).optional(),

  price: z.number().nonnegative().optional(),
  originalPrice: z.number().nonnegative().optional(),
  currency: z.string().min(1).max(10).optional(),

  rating: z.number().min(0).max(5).optional(),
  reviewsCount: z.number().int().min(0).optional(),

  destaque: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  available: z.boolean().optional(),
  active: z.boolean().optional(),

  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const updateProductOfferSchema = z.object({
  externalLink: z.string().url(),

  catalogProductId: z.string().regex(/^MLB\d+$/i),
  itemId: z.string().regex(/^MLB\d+$/i),
  sellerId: z.string().regex(/^\d+$/),
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

    const input = {
      affiliateUrl: body.affiliateUrl,
      externalLink: body.externalLink,
      catalogProductId: body.catalogProductId,
      itemId: body.itemId,
      sellerId: body.sellerId,
      subcategoryId: body.subcategoryId,
      title: body.title,

      ...(body.description !== undefined
        ? { description: body.description }
        : {}),

      ...(body.shortDescription !== undefined
        ? { shortDescription: body.shortDescription }
        : {}),

      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),

      ...(body.images !== undefined
        ? {
            images: body.images.map((image) =>
              image.sortOrder !== undefined
                ? {
                    imageUrl: image.imageUrl,
                    sortOrder: image.sortOrder,
                  }
                : {
                    imageUrl: image.imageUrl,
                  },
            ),
          }
        : {}),

      ...(body.price !== undefined ? { price: body.price } : {}),

      ...(body.originalPrice !== undefined
        ? { originalPrice: body.originalPrice }
        : {}),

      ...(body.currency !== undefined ? { currency: body.currency } : {}),

      ...(body.rating !== undefined ? { rating: body.rating } : {}),

      ...(body.reviewsCount !== undefined
        ? { reviewsCount: body.reviewsCount }
        : {}),

      ...(body.destaque !== undefined ? { destaque: body.destaque } : {}),

      ...(body.bestSeller !== undefined ? { bestSeller: body.bestSeller } : {}),

      ...(body.available !== undefined ? { available: body.available } : {}),

      ...(body.active !== undefined ? { active: body.active } : {}),

      ...(body.seoTitle !== undefined ? { seoTitle: body.seoTitle } : {}),

      ...(body.seoDescription !== undefined
        ? { seoDescription: body.seoDescription }
        : {}),
    };

    const product = await importMercadoLivreProduct(input);

    return response.status(201).json({
      message: "Produto do Mercado Livre importado com sucesso",
      product,
    });
  }

  async updateProductOffer(request: Request, response: Response) {
    const productId = z.string().uuid().parse(request.params.productId);

    const body = updateProductOfferSchema.parse(request.body);

    const product = await updateMercadoLivreProductOffer(productId, body);

    return response.status(200).json({
      message: "Oferta do Mercado Livre atualizada com sucesso",
      product,
    });
  }

  async sync(_request: Request, response: Response) {
    const result = await syncMercadoLivreProducts();

    return response.json({
      message: "Produtos do Mercado Livre sincronizados com sucesso",
      products: result.products,
    });
  }
}
