import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { subcategoryService } from "../services/subcategory-services";
import { createSlug } from "../utils/createSlug";

interface IdParams {
  id: string;
}

export const subcategorySchema = z.object({
  categoryId: z.string().uuid("ID da categoria inválido"),
  name: z
    .string()
    .min(2, "O nome da subcategoria deve ter pelo menos 2 caracteres"),
  slug: z
    .string()
    .min(2)
    .transform((val) => createSlug(val)),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export class SubcategoryController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = subcategorySchema.parse(req.body);
      const subcategory = await subcategoryService.create(parsedData);
      res.status(201).json(subcategory);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response) {
    const subcategories = await subcategoryService.list();
    res.json(subcategories);
  }

  async get(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      const subcategory = await subcategoryService.get(req.params.id);
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategoria não encontrada" });
      }
      res.json(subcategory);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      const subcategory = await subcategoryService.update(
        req.params.id,
        req.body,
      );
      res.json(subcategory);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      await subcategoryService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
