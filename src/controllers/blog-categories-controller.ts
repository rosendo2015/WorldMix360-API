import type { Request, Response } from "express";
import { z } from "zod";

import { blogCategoriesService } from "@/services/blog-categories-service";
import { createSlug } from "@/utils/createSlug";

const createBlogCategorySchema = z.object({
  name: z.string().trim().min(1, "O nome da categoria é obrigatório"),
  description: z.string().trim().optional(),
  image: z.string().trim().url("A imagem deve ser uma URL válida").optional(),
  active: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const updateBlogCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome da categoria é obrigatório")
    .optional(),
  description: z.string().trim().optional(),
  image: z.string().trim().url("A imagem deve ser uma URL válida").optional(),
  active: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const idSchema = z.object({
  id: z.string().uuid("ID da categoria do blog inválido"),
});

const slugSchema = z.object({
  slug: z.string().trim().min(1, "Slug inválido"),
});

export class BlogCategoriesController {
  async index(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        active: z
          .enum(["true", "false"])
          .transform((value) => value === "true")
          .optional(),
      })
      .parse(request.query);

    const categories = await blogCategoriesService.list({
      ...(query.search !== undefined
        ? {
            search: query.search,
          }
        : {}),
      ...(query.active !== undefined
        ? {
            active: query.active,
          }
        : {}),
    });

    return response.json({
      categories,
    });
  }

  async showById(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const category = await blogCategoriesService.findById(id);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    return response.json({
      category,
    });
  }

  async showBySlug(request: Request, response: Response) {
    const { slug } = slugSchema.parse(request.params);

    const category = await blogCategoriesService.findBySlug(slug);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    return response.json({
      category,
    });
  }

  async create(request: Request, response: Response) {
    const data = createBlogCategorySchema.parse(request.body);

    const slug = createSlug(data.name);

    const existingCategory = await blogCategoriesService.findBySlug(slug);

    if (existingCategory) {
      return response.status(409).json({
        message: "Já existe uma categoria do blog com esse nome.",
      });
    }

    const category = await blogCategoriesService.create({
      name: data.name,
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
    });

    return response.status(201).json({
      category,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);
    const data = updateBlogCategorySchema.parse(request.body);

    const category = await blogCategoriesService.findById(id);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    let slug: string | undefined;

    if (data.name !== undefined && data.name !== category.name) {
      slug = createSlug(data.name);

      const existingCategory = await blogCategoriesService.findBySlugExceptId(
        slug,
        category.id,
      );

      if (existingCategory) {
        return response.status(409).json({
          message: "Já existe uma categoria do blog com esse nome.",
        });
      }
    }

    const updatedCategory = await blogCategoriesService.update(category.id, {
      ...(data.name !== undefined
        ? {
            name: data.name,
          }
        : {}),
      ...(slug !== undefined
        ? {
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
    });

    return response.json({
      category: updatedCategory,
    });
  }

  async delete(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const category = await blogCategoriesService.findById(id);

    if (!category) {
      return response.status(404).json({
        message: "Categoria do blog não encontrada",
      });
    }

    await blogCategoriesService.delete(category.id);

    return response.status(204).send();
  }
}
