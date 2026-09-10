import type { Request, Response } from "express";
import { z } from "zod";

import { BlogPostStatus } from "@/generated/prisma/client";
import { blogService } from "@/services/blog-service";
import { createSlug } from "@/utils/createSlug";

const blogPostProductSchema = z.object({
  productId: z.string().uuid("ID do produto inválido"),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const createBlogPostSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório"),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(1, "O conteúdo é obrigatório"),
  coverImage: z.string().trim().url().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),

  status: z.enum(BlogPostStatus).default(BlogPostStatus.DRAFT),

  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),

  categoryId: z.string().uuid("ID da categoria do blog inválido").optional(),

  products: z.array(blogPostProductSchema).optional(),
});

const updateBlogPostSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório").optional(),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(1, "O conteúdo é obrigatório").optional(),
  coverImage: z.string().trim().url().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),

  status: z.enum(BlogPostStatus).optional(),

  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),

  categoryId: z.string().uuid("ID da categoria do blog inválido").optional(),

  products: z.array(blogPostProductSchema).optional(),
});

const idSchema = z.object({
  id: z.string().uuid("ID do post inválido"),
});

const slugSchema = z.object({
  slug: z.string().trim().min(1, "Slug inválido"),
});

export class BlogController {
  async index(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        categoryId: z.string().uuid().optional(),
      })
      .parse(request.query);

    const posts = await blogService.list({
      ...(query.search !== undefined ? { search: query.search } : {}),

      ...(query.categoryId !== undefined
        ? { categoryId: query.categoryId }
        : {}),
    });

    return response.json({
      posts,
    });
  }

  async indexAdmin(request: Request, response: Response) {
    const query = z
      .object({
        search: z.string().trim().optional(),
        categoryId: z.string().uuid().optional(),
        status: z.enum(BlogPostStatus).optional(),
      })
      .parse(request.query);

    const posts = await blogService.listAdmin({
      ...(query.search !== undefined ? { search: query.search } : {}),

      ...(query.categoryId !== undefined
        ? { categoryId: query.categoryId }
        : {}),

      ...(query.status !== undefined ? { status: query.status } : {}),
    });

    return response.json({
      posts,
    });
  }

  async create(request: Request, response: Response) {
    const data = createBlogPostSchema.parse(request.body);

    const slug = createSlug(data.title);

    const existingPost = await blogService.findBySlug(slug);

    if (existingPost) {
      return response.status(409).json({
        message: "Já existe um post com esse título.",
      });
    }

    const post = await blogService.create({
      title: data.title,
      content: data.content,
      authorId: request.user.id,

      ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),

      ...(data.coverImage !== undefined ? { coverImage: data.coverImage } : {}),

      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),

      ...(data.seoDescription !== undefined
        ? { seoDescription: data.seoDescription }
        : {}),

      ...(data.status !== undefined ? { status: data.status } : {}),

      ...(data.publishedAt !== undefined
        ? { publishedAt: data.publishedAt }
        : {}),

      ...(data.scheduledAt !== undefined
        ? { scheduledAt: data.scheduledAt }
        : {}),

      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),

      ...(data.products !== undefined
        ? {
            products: data.products.map((product) => ({
              productId: product.productId,
              ...(product.sortOrder !== undefined
                ? { sortOrder: product.sortOrder }
                : {}),
            })),
          }
        : {}),
    });

    return response.status(201).json({
      post,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const data = updateBlogPostSchema.parse(request.body);

    const post = await blogService.findById(id);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    if (data.title && data.title !== post.title) {
      const slug = createSlug(data.title);

      const existingPost = await blogService.findBySlugExceptId(slug, post.id);

      if (existingPost) {
        return response.status(409).json({
          message: "Já existe um post com esse título.",
        });
      }
    }

    const updatedPost = await blogService.update(post.id, {
      ...(data.title !== undefined ? { title: data.title } : {}),

      ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),

      ...(data.content !== undefined ? { content: data.content } : {}),

      ...(data.coverImage !== undefined ? { coverImage: data.coverImage } : {}),

      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),

      ...(data.seoDescription !== undefined
        ? { seoDescription: data.seoDescription }
        : {}),

      ...(data.status !== undefined ? { status: data.status } : {}),

      ...(data.publishedAt !== undefined
        ? { publishedAt: data.publishedAt }
        : {}),

      ...(data.scheduledAt !== undefined
        ? { scheduledAt: data.scheduledAt }
        : {}),

      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),

      ...(data.products !== undefined
        ? {
            products: data.products.map((product) => ({
              productId: product.productId,
              ...(product.sortOrder !== undefined
                ? { sortOrder: product.sortOrder }
                : {}),
            })),
          }
        : {}),
    });

    return response.json({
      post: updatedPost,
    });
  }

  async delete(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const post = await blogService.findById(id);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    await blogService.delete(post.id);

    return response.status(204).send();
  }

  async showById(request: Request, response: Response) {
    const { id } = idSchema.parse(request.params);

    const post = await blogService.findById(id);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    return response.json({
      post,
    });
  }

  async show(request: Request, response: Response) {
    const { slug } = slugSchema.parse(request.params);

    const post = await blogService.findBySlug(slug);

    if (!post) {
      return response.status(404).json({
        message: "Post não encontrado",
      });
    }

    return response.json({
      post,
    });
  }
}
