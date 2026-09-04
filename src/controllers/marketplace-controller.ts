import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { marketplaceService } from "../services/marketplace-service";
import { createSlug } from "../utils/createSlug";

interface IdParams {
  id: string;
}

export const marketplaceSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do marketplace deve ter pelo menos 2 caracteres"),
  slug: z
    .string()
    .min(2)
    .transform((val) => createSlug(val)),
  description: z.string().optional(),
  websiteUrl: z.string().url("Website deve ser uma URL válida").optional(),
  logoUrl: z.string().url("Logo deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export class MarketplaceController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = marketplaceSchema.parse(req.body);
      const marketplace = await marketplaceService.create(parsedData);
      res.status(201).json(marketplace);
    } catch (error) {
      next(error);
    }
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

  async update(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      const marketplace = await marketplaceService.update(
        req.params.id,
        req.body,
      );
      res.json(marketplace);
    } catch (error) {
      next(error);
    }
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
