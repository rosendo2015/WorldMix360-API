import { prisma } from "@/database/prisma";
import { BlogPostStatus } from "@/generated/prisma/client";

interface BlogPostProductInput {
  productId: string;
  sortOrder?: number;
}

interface CreateBlogPostInput {
  title: string;
  content: string;
  authorId: string;
  excerpt?: string;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: BlogPostStatus;
  publishedAt?: Date;
  scheduledAt?: Date;
  categoryId?: string;
  products?: BlogPostProductInput[];
}

interface UpdateBlogPostInput {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: BlogPostStatus;
  publishedAt?: Date;
  scheduledAt?: Date;
  categoryId?: string;
  products?: BlogPostProductInput[];
}

interface ListBlogPostsInput {
  search?: string;
  categoryId?: string;
}

interface ListAdminBlogPostsInput {
  search?: string;
  categoryId?: string;
  status?: BlogPostStatus;
}

const blogPostInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },

  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  products: {
    orderBy: {
      sortOrder: "asc" as const,
    },

    select: {
      id: true,
      sortOrder: true,

      product: {
        select: {
          id: true,
          title: true,
          slug: true,
          shortDescription: true,
          imageUrl: true,
          price: true,
          originalPrice: true,
          currency: true,
          rating: true,
          reviewsCount: true,
          affiliateUrl: true,
          available: true,
          featured: true,
          active: true,
        },
      },
    },
  },
};

function serializeBlogPost(post: any) {
  return {
    ...post,

    products: post.products.map((item: any) => ({
      id: item.id,
      sortOrder: item.sortOrder,
      product: item.product,
    })),
  };
}

function serializeBlogPosts(posts: any[]) {
  return posts.map(serializeBlogPost);
}

function createBlogSlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const blogService = {
  async list(input: ListBlogPostsInput = {}) {
    const where: {
      status: BlogPostStatus;
      OR?: Array<{
        title?: {
          contains: string;
          mode: "insensitive";
        };
        excerpt?: {
          contains: string;
          mode: "insensitive";
        };
        content?: {
          contains: string;
          mode: "insensitive";
        };
      }>;
      categoryId?: string;
    } = {
      status: BlogPostStatus.PUBLISHED,
    };

    if (input.search !== undefined) {
      where.OR = [
        {
          title: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          excerpt: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: input.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (input.categoryId !== undefined) {
      where.categoryId = input.categoryId;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: blogPostInclude,
      orderBy: {
        publishedAt: "desc",
      },
    });

    return serializeBlogPosts(posts);
  },

  async listAdmin(input: ListAdminBlogPostsInput = {}) {
    const where: {
      OR?: Array<{
        title?: {
          contains: string;
          mode: "insensitive";
        };
        excerpt?: {
          contains: string;
          mode: "insensitive";
        };
        content?: {
          contains: string;
          mode: "insensitive";
        };
      }>;
      categoryId?: string;
      status?: BlogPostStatus;
    } = {};

    if (input.search !== undefined) {
      where.OR = [
        {
          title: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          excerpt: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: input.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (input.categoryId !== undefined) {
      where.categoryId = input.categoryId;
    }

    if (input.status !== undefined) {
      where.status = input.status;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: blogPostInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    return serializeBlogPosts(posts);
  },

  async findById(id: string) {
    const post = await prisma.blogPost.findUnique({
      where: {
        id,
      },
      include: blogPostInclude,
    });

    if (!post) {
      return null;
    }

    return serializeBlogPost(post);
  },

  async findBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
      },
      include: blogPostInclude,
    });

    if (!post) {
      return null;
    }

    return serializeBlogPost(post);
  },

  async findBySlugExceptId(slug: string, id: string) {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      include: blogPostInclude,
    });

    if (!post) {
      return null;
    }

    return serializeBlogPost(post);
  },

  async create(data: CreateBlogPostInput) {
    const postData = {
      title: data.title,
      slug: createBlogSlug(data.title),
      content: data.content,

      author: {
        connect: {
          id: data.authorId,
        },
      },

      ...(data.excerpt !== undefined
        ? {
            excerpt: data.excerpt,
          }
        : {}),

      ...(data.coverImage !== undefined
        ? {
            coverImage: data.coverImage,
          }
        : {}),

      ...(data.seoTitle !== undefined
        ? {
            seoTitle: data.seoTitle,
          }
        : {}),

      ...(data.seoDescription !== undefined
        ? {
            seoDescription: data.seoDescription,
          }
        : {}),

      ...(data.status !== undefined
        ? {
            status: data.status,
          }
        : {}),

      ...(data.publishedAt !== undefined
        ? {
            publishedAt: data.publishedAt,
          }
        : {}),

      ...(data.scheduledAt !== undefined
        ? {
            scheduledAt: data.scheduledAt,
          }
        : {}),

      ...(data.categoryId !== undefined
        ? {
            category: {
              connect: {
                id: data.categoryId,
              },
            },
          }
        : {}),

      ...(data.products !== undefined && data.products.length > 0
        ? {
            products: {
              create: data.products.map((product) => ({
                sortOrder: product.sortOrder ?? 0,

                product: {
                  connect: {
                    id: product.productId,
                  },
                },
              })),
            },
          }
        : {}),
    };

    const post = await prisma.blogPost.create({
      data: postData,
      include: blogPostInclude,
    });

    return serializeBlogPost(post);
  },

  async update(id: string, data: UpdateBlogPostInput) {
    const postData = {
      ...(data.title !== undefined
        ? {
            title: data.title,
            slug: createBlogSlug(data.title),
          }
        : {}),

      ...(data.excerpt !== undefined
        ? {
            excerpt: data.excerpt,
          }
        : {}),

      ...(data.content !== undefined
        ? {
            content: data.content,
          }
        : {}),

      ...(data.coverImage !== undefined
        ? {
            coverImage: data.coverImage,
          }
        : {}),

      ...(data.seoTitle !== undefined
        ? {
            seoTitle: data.seoTitle,
          }
        : {}),

      ...(data.seoDescription !== undefined
        ? {
            seoDescription: data.seoDescription,
          }
        : {}),

      ...(data.status !== undefined
        ? {
            status: data.status,
          }
        : {}),

      ...(data.publishedAt !== undefined
        ? {
            publishedAt: data.publishedAt,
          }
        : {}),

      ...(data.scheduledAt !== undefined
        ? {
            scheduledAt: data.scheduledAt,
          }
        : {}),
    };

    const post = await prisma.$transaction(async (transaction) => {
      if (data.products !== undefined) {
        await transaction.blogPostProduct.deleteMany({
          where: {
            postId: id,
          },
        });
      }

      const updatedPost = await transaction.blogPost.update({
        where: {
          id,
        },

        data: {
          ...postData,

          ...(data.categoryId !== undefined
            ? {
                category: {
                  connect: {
                    id: data.categoryId,
                  },
                },
              }
            : {}),

          ...(data.products !== undefined
            ? {
                products: {
                  create: data.products.map((product) => ({
                    sortOrder: product.sortOrder ?? 0,

                    product: {
                      connect: {
                        id: product.productId,
                      },
                    },
                  })),
                },
              }
            : {}),
        },

        include: blogPostInclude,
      });

      return updatedPost;
    });

    return serializeBlogPost(post);
  },

  async delete(id: string) {
    await prisma.blogPost.delete({
      where: {
        id,
      },
    });
  },
};
