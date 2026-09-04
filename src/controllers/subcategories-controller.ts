import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { subcategoriesService } from "../services/subcategories-services";
import { createSlug } from "../utils/createSlug";

interface IdParams {
  id: string;
}

const createSubcategorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z
    .string()
    .min(2, "O nome da subcategoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const updateSubcategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export class SubcategoriesController {
  async create(request: Request, response: Response) {
    const data = createSubcategorySchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingSubcategory = await prisma.subcategory.findUnique({
      where: {
        categoryId_slug: {
          categoryId: data.categoryId,
          slug,
        },
      },
    });

    if (existingSubcategory) {
      return response
        .status(409)
        .json({ message: "Já existe uma subcategoria com esse nome." });
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        slug,
        description: data.description ?? null,
        image: data.image ?? null,
        active: data.active,
        sortOrder: data.sortOrder,
      },
    });

    return response.status(201).json({ subcategory });
  }

  async list(req: Request, res: Response) {
    const subcategories = await subcategoriesService.list();
    res.json(subcategories);
  }

  async get(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      const subcategory = await subcategoriesService.get(req.params.id);
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategoria não encontrada" });
      }
      res.json(subcategory);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response) {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const data = updateSubcategorySchema.parse(request.body);

    const subcategory = await prisma.subcategory.findUnique({
      where: { id: params.id },
    });

    if (!subcategory) {
      return response
        .status(404)
        .json({ message: "Subcategoria não encontrada" });
    }

    let slug = subcategory.slug;

    if (data.name && data.name !== subcategory.name) {
      slug = createSlug(data.name);

      const existingSubcategory = await prisma.subcategory.findFirst({
        where: { slug, id: { not: subcategory.id } },
      });

      if (existingSubcategory) {
        return response
          .status(409)
          .json({ message: "Já existe uma subcategoria com esse nome." });
      }
    }

    const updatedSubcategory = await prisma.subcategory.update({
      where: { id: subcategory.id },
      data: {
        ...(data.name !== undefined ? { name: data.name, slug } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
    });

    return response.json({ subcategory: updatedSubcategory });
  }

  async delete(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      await subcategoriesService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
