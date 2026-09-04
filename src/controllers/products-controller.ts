/* src/controllers/products-controller.ts */

import type { Request, Response } from "express";
import { z } from "zod";

import { prisma } from "@/database/prisma";
import { syncMercadoLivreProducts } from "@/services/mercado-livre-service";
import { createSlug } from "@/utils/createSlug";

const createProductSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),

  imageUrl: z.string().trim().url(),

  price: z.coerce.number().nonnegative(),
  originalPrice: z.coerce.number().nonnegative().optional(),

  currency: z.string().trim().default("BRL"),

  rating: z.coerce.number().min(0).max(5).optional(),
  reviewsCount: z.coerce.number().int().nonnegative().default(0),

  affiliateUrl: z.string().trim().url(),

  // relações obrigatórias
  subcategoryId: z.string().uuid("ID da subcategoria inválido"),
  marketplaceId: z.string().uuid("ID do marketplace inválido"),

  featured: z.coerce.boolean().default(false),
  available: z.coerce.boolean().default(true),
  active: z.coerce.boolean().default(true),

  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

const updateProductSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),

  imageUrl: z.string().trim().url().optional(),

  price: z.coerce.number().nonnegative().optional(),
  originalPrice: z.coerce.number().nonnegative().optional(),

  currency: z.string().trim().optional(),

  rating: z.coerce.number().min(0).max(5).optional(),
  reviewsCount: z.coerce.number().int().nonnegative().optional(),

  affiliateUrl: z.string().trim().url().optional(),

  // relações opcionais no update
  subcategoryId: z.string().uuid().optional(),
  marketplaceId: z.string().uuid().optional(),

  featured: z.coerce.boolean().optional(),
  available: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),

  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

const updateProductStatusSchema = z
  .object({
    active: z.coerce.boolean().optional(),
    available: z.coerce.boolean().optional(),
    featured: z.coerce.boolean().optional(),
  })
  .refine(
    (data) =>
      data.active !== undefined ||
      data.available !== undefined ||
      data.featured !== undefined,
    {
      message: "Informe pelo menos um status para atualizar.",
    },
  );

export class ProductsController {
  async index(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        subcategoryId: z.string().uuid().optional(),
        marketplaceId: z.string().uuid().optional(),
        featured: z.coerce.boolean().optional(),
      })
      .parse(request.query);

    const products = await prisma.product.findMany({
      where: {
        available: true,
        ...(query.subcategoryId ? { subcategoryId: query.subcategoryId } : {}),
        ...(query.marketplaceId ? { marketplaceId: query.marketplaceId } : {}),
        ...(query.featured !== undefined ? { featured: query.featured } : {}),
        ...(query.search
          ? {
              title: {
                contains: query.search,
                mode: "insensitive",
              },
            }
          : {}),
      },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    });

    return response.json({ products });
  }

  async create(request: Request, response: Response) {
    const data = createProductSchema.parse(request.body);

    const slug = createSlug(data.title);

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return response.status(409).json({
        message: "Já existe um produto com esse título.",
      });
    }

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug,
        description: data.description ?? null,
        shortDescription: data.shortDescription ?? null,
        imageUrl: data.imageUrl,
        price: data.price,
        originalPrice: data.originalPrice ?? null,
        currency: data.currency,
        rating: data.rating ?? null,
        reviewsCount: data.reviewsCount,
        affiliateUrl: data.affiliateUrl,
        featured: data.featured,
        available: data.available,
        active: data.active,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,

        // relações obrigatórias
        subcategory: { connect: { id: data.subcategoryId } },
        marketplace: { connect: { id: data.marketplaceId } },
      },
    });

    return response.status(201).json({ product });
  }

  async update(request: Request, response: Response) {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const data = updateProductSchema.parse(request.body);

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }

    let slug = product.slug;

    if (data.title && data.title !== product.title) {
      slug = createSlug(data.title);

      const existingProduct = await prisma.product.findFirst({
        where: { slug, id: { not: product.id } },
      });

      if (existingProduct) {
        return response
          .status(409)
          .json({ message: "Já existe um produto com esse título." });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        ...(data.title !== undefined ? { title: data.title, slug } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.shortDescription !== undefined
          ? { shortDescription: data.shortDescription }
          : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.originalPrice !== undefined
          ? { originalPrice: data.originalPrice }
          : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
        ...(data.rating !== undefined ? { rating: data.rating } : {}),
        ...(data.reviewsCount !== undefined
          ? { reviewsCount: data.reviewsCount }
          : {}),
        ...(data.affiliateUrl !== undefined
          ? { affiliateUrl: data.affiliateUrl }
          : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.available !== undefined ? { available: data.available } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
        ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
        ...(data.seoDescription !== undefined
          ? { seoDescription: data.seoDescription }
          : {}),
        ...(data.subcategoryId
          ? { subcategory: { connect: { id: data.subcategoryId } } }
          : {}),
        ...(data.marketplaceId
          ? { marketplace: { connect: { id: data.marketplaceId } } }
          : {}),
      },
    });

    return response.json({ product: updatedProduct });
  }

  async updateStatus(request: Request, response: Response) {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const data = updateProductStatusSchema.parse(request.body);

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        ...(data.active !== undefined ? { active: data.active } : {}),
        ...(data.available !== undefined ? { available: data.available } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
      },
    });

    return response.json({ product: updatedProduct });
  }

  async sync(request: Request, response: Response) {
    const expectedSecret = process.env.PRODUCT_SYNC_SECRET;
    const receivedSecret = request.header("x-sync-token");

    if (!expectedSecret || receivedSecret !== expectedSecret) {
      return response.status(401).json({ message: "Não autorizado" });
    }

    const products = await syncMercadoLivreProducts();

    return response.json({ products, synced: products.length });
  }

  async show(request: Request, response: Response) {
    const params = z
      .object({ slug: z.string().trim().min(1) })
      .parse(request.params);

    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
    });

    if (!product) {
      return response.status(404).json({ message: "Produto não encontrado" });
    }

    return response.json({
      product,
    });
  }
}
