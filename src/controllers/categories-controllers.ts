import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { categoryService } from "../services/categories-service";
import { createSlug } from "../utils/createSlug";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome da categoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome da categoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const idSchema = z.object({
  id: z.string().uuid(),
});

export class CategoryController {
  async create(request: Request, response: Response) {
    const data = createCategorySchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return response
        .status(409)
        .json({ message: "Já existe uma categoria com esse nome." });
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
        image: data.image ?? null,
      },
    });

    return response.status(201).json({ category });
  }

  async list(req: Request, res: Response) {
    const categories = await categoryService.list();
    return res.json(categories);
  }

  async get(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const category = await categoryService.get(id);

    if (!category) {
      return res.status(404).json({
        error: "Categoria não encontrada",
      });
    }

    return res.json(category);
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const data = updateCategorySchema.parse(request.body);

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return response.status(404).json({
        message: "Categoria não encontrada",
      });
    }

    let slug = category.slug;

    if (data.name && data.name !== category.name) {
      slug = createSlug(data.name);

      const existingCategory = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: category.id },
        },
      });

      if (existingCategory) {
        return response
          .status(409)
          .json({ message: "Já existe uma categoria com esse nome." });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: category.id,
      },
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

    return response.json({
      category: updatedCategory,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    await categoryService.delete(id);

    return res.status(204).send();
  }
}
