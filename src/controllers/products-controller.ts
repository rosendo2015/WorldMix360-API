import type { Request, Response } from "express";
import { z } from "zod";

import { syncMercadoLivreProducts } from "@/services/mercado-livre-service";
import { productsService } from "@/services/products-service";

import { createSlug } from "@/utils/createSlug";

const productImageSchema = z.object({
  imageUrl: z.string().trim().url(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const createProductSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  imageUrl: z.string().trim().url(),
  images: z.array(productImageSchema).optional(),
  price: z.coerce.number().nonnegative(),
  originalPrice: z.coerce.number().nonnegative().optional(),
  currency: z.string().trim().default("BRL"),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewsCount: z.coerce.number().int().nonnegative().default(0),
  affiliateUrl: z.string().trim().url(),
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
  images: z.array(productImageSchema).optional(),
  price: z.coerce.number().nonnegative().optional(),
  originalPrice: z.coerce.number().nonnegative().optional(),
  currency: z.string().trim().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewsCount: z.coerce.number().int().nonnegative().optional(),
  affiliateUrl: z.string().trim().url().optional(),
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

const idSchema = z.object({
  id: z.string().uuid(),
});

const slugSchema = z.object({
  slug: z.string().trim().min(1),
});

type CreateProductData = z.infer<typeof createProductSchema>;
type UpdateProductData = z.infer<typeof updateProductSchema>;
type UpdateProductStatusData = z.infer<typeof updateProductStatusSchema>;

export class ProductsController {
  async index(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        category: z.string().trim().optional(),
        subcategoryId: z.string().uuid().optional(),
        marketplaceId: z.string().uuid().optional(),
        featured: z.coerce.boolean().optional(),
      })
      .parse(request.query);

    const products = await productsService.list(query);

    return response.json({
      products,
    });
  }

  async indexAdmin(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        subcategoryId: z.string().uuid().optional(),
        marketplaceId: z.string().uuid().optional(),
        featured: z.coerce.boolean().optional(),
        active: z.coerce.boolean().optional(),
        available: z.coerce.boolean().optional(),
      })
      .parse(request.query);

    const products = await productsService.listAdmin(query);

    return response.json({
      products,
    });
  }

  async create(request: Request, response: Response) {
    const data: CreateProductData = createProductSchema.parse(request.body);
    const slug = createSlug(data.title);
    const existingProduct = await productsService.findBySlug(slug);

    if (existingProduct) {
      return response.status(409).json({
        message: "Já existe um produto com esse título.",
      });
    }

    const product = await productsService.create(data);

    return response.status(201).json({ product });
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const data: UpdateProductData = updateProductSchema.parse(request.body);
    const product = await productsService.findById(id);

    if (!product) {
      return response.status(404).json({
        message: "Produto não encontrado",
      });
    }

    if (data.title && data.title !== product.title) {
      const slug = createSlug(data.title);
      const existingProduct = await productsService.findBySlugExceptId(
        slug,
        product.id,
      );

      if (existingProduct) {
        return response.status(409).json({
          message: "Já existe um produto com esse título.",
        });
      }
    }

    const updatedProduct = await productsService.update(product.id, data);

    return response.json({ product: updatedProduct });
  }

  async updateStatus(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const data: UpdateProductStatusData = updateProductStatusSchema.parse(
      request.body,
    );
    const product = await productsService.findById(id);

    if (!product) {
      return response.status(404).json({
        message: "Produto não encontrado",
      });
    }

    const updatedProduct = await productsService.updateStatus(product.id, data);

    return response.json({ product: updatedProduct });
  }

  async sync(request: Request, response: Response) {
    const expectedSecret = process.env.PRODUCT_SYNC_SECRET;
    const receivedSecret = request.header("x-sync-token");

    if (!expectedSecret || receivedSecret !== expectedSecret) {
      return response.status(401).json({
        message: "Não autorizado",
      });
    }

    const products = await syncMercadoLivreProducts();

    return response.json({
      products,
      synced: products.length,
    });
  }

  async showById(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const product = await productsService.findById(id);

    if (!product) {
      return response.status(404).json({
        message: "Produto não encontrado",
      });
    }

    return response.json({ product });
  }

  async show(request: Request, response: Response) {
    const { slug } = slugSchema.parse(request.params);
    const product = await productsService.findBySlug(slug);

    if (!product) {
      return response.status(404).json({
        message: "Produto não encontrado",
      });
    }

    return response.json({ product });
  }
}
