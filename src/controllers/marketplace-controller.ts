import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { marketplaceService } from "../services/marketplace-service";
import { createSlug } from "../utils/createSlug";

interface IdParams {
  id: string;
}

const createMarketplaceSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do marketplace deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  websiteUrl: z.string().url("Website deve ser uma URL válida").optional(),
  logoUrl: z.string().url("Logo deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const updateMarketplaceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export class MarketplaceController {
  async create(request: Request, response: Response) {
    const data = createMarketplaceSchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingMarketplace = await prisma.marketplace.findUnique({
      where: { slug },
    });

    if (existingMarketplace) {
      return response
        .status(409)
        .json({ message: "Já existe um marketplace com esse nome." });
    }

    const marketplace = await prisma.marketplace.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        websiteUrl: data.websiteUrl ?? null,
        logoUrl: data.logoUrl ?? null,
        active: data.active,
        sortOrder: data.sortOrder,
      },
    });

    return response.status(201).json({ marketplace });
  }

  async list(req: Request, res: Response) {
    const marketplaces = await marketplaceService.list();
    res.json(marketplaces);
  }

  async get(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      const marketplace = await marketplaceService.get(req.params.id);
      if (!marketplace) {
        return res.status(404).json({ error: "Marketplace não encontrado" });
      }
      res.json(marketplace);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response) {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const data = updateMarketplaceSchema.parse(request.body);

    const marketplace = await prisma.marketplace.findUnique({
      where: { id: params.id },
    });

    if (!marketplace) {
      return response
        .status(404)
        .json({ message: "Marketplace não encontrado" });
    }

    let slug = marketplace.slug;

    if (data.name && data.name !== marketplace.name) {
      slug = createSlug(data.name);

      const existingMarketplace = await prisma.marketplace.findFirst({
        where: { slug, id: { not: marketplace.id } },
      });

      if (existingMarketplace) {
        return response
          .status(409)
          .json({ message: "Já existe um marketplace com esse nome." });
      }
    }

    const updatedMarketplace = await prisma.marketplace.update({
      where: { id: marketplace.id },
      data: {
        ...(data.name !== undefined ? { name: data.name, slug } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.websiteUrl !== undefined
          ? { websiteUrl: data.websiteUrl }
          : {}),
        ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
    });

    return response.json({ marketplace: updatedMarketplace });
  }

  async delete(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      await marketplaceService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
