import type { Request, Response } from "express";
import { z } from "zod";
import { mercadoLivreConfig } from "@/configs/mercado-livre";
import { prisma } from "@/database/prisma";
import { syncMercadoLivreProducts } from "@/services/mercado-livre-service";

export class ProductsController {
  async index(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        category: z.string().trim().optional(),
        featured: z.coerce.boolean().optional(),
      })
      .parse(request.query);
    const products = await prisma.product.findMany({
      where: {
        available: true,
        ...(query.category ? { category: query.category } : {}),
        ...(query.featured !== undefined ? { featured: query.featured } : {}),
        ...(query.search
          ? { title: { contains: query.search, mode: "insensitive" } }
          : {}),
      },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    });
    return response.json({ products });
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
}
