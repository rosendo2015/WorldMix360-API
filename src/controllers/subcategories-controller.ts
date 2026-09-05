import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { subcategoriesService } from "../services/subcategories-services";
import { createSlug } from "../utils/createSlug";

export const subcategorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z
    .string()
    .min(2, "O nome da subcategoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  image: z.string().url("Imagem deve ser uma URL válida").optional(),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

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

const idSchema = z.object({
  id: z.string().uuid(),
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
      return response.status(409).json({
        message: "Já existe uma subcategoria com esse nome.",
      });
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

    return response.status(201).json({
      subcategory,
    });
  }

  async list(req: Request, res: Response) {
    const subcategories = await subcategoriesService.list();

    return res.json(subcategories);
  }

  async get(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    const subcategory = await subcategoriesService.get(id);

    if (!subcategory) {
      return res.status(404).json({
        error: "Subcategoria não encontrada",
      });
    }

    return res.json(subcategory);
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const data = updateSubcategorySchema.parse(request.body);

    const subcategory = await prisma.subcategory.findUnique({
      where: {
        id,
      },
    });

    if (!subcategory) {
      return response.status(404).json({
        message: "Subcategoria não encontrada",
      });
    }

    let slug = subcategory.slug;

    if (data.name && data.name !== subcategory.name) {
      slug = createSlug(data.name);

      const existingSubcategory = await prisma.subcategory.findFirst({
        where: {
          slug,
          id: {
            not: subcategory.id,
          },
        },
      });

      if (existingSubcategory) {
        return response.status(409).json({
          message: "Já existe uma subcategoria com esse nome.",
        });
      }
    }

    const updatedSubcategory = await prisma.subcategory.update({
      where: {
        id: subcategory.id,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
              slug,
            }
          : {}),
        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),
        ...(data.image !== undefined
          ? {
              image: data.image,
            }
          : {}),
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),
        ...(data.sortOrder !== undefined
          ? {
              sortOrder: data.sortOrder,
            }
          : {}),
      },
    });

    return response.json({
      subcategory: updatedSubcategory,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params);

    await subcategoriesService.delete(id);

    return res.status(204).send();
  }
}
