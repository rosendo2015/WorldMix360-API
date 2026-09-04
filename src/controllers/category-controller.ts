// src/controllers/category-controller.ts
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { categoryService } from "../services/category-service";
import { createSlug } from "../utils/createSlug";

interface IdParams {
  id: string;
}

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome da categoria deve ter pelo menos 2 caracteres"),
  slug: z
    .string()
    .min(2, "O slug deve ter pelo menos 2 caracteres")
    .transform((val) => createSlug(val)), // normaliza com sua função
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export class CategoryController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = categorySchema.parse(req.body);
      const category = await categoryService.create(parsedData);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response) {
    const categories = await categoryService.list();
    res.json(categories);
  }

  async get(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.get(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.update(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
