import { prisma } from "@/database/prisma";

interface ListBlogCategoriesParams {
  search?: string;
  active?: boolean;
}

interface CreateBlogCategoryData {
  name: string;
  description?: string;
  image?: string;
  active?: boolean;
  sortOrder?: number;
}

interface UpdateBlogCategoryData {
  name?: string;
  description?: string;
  image?: string;
  active?: boolean;
  sortOrder?: number;
  slug?: string;
}

function normalizeSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function serializeBlogCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date | null;
  _count?: {
    posts: number;
  };
}) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    active: category.active,
    sortOrder: category.sortOrder,
    postsCount: category._count?.posts ?? 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

const blogCategoryInclude = {
  _count: {
    select: {
      posts: true,
    },
  },
};

export const blogCategoriesService = {
  async list(params: ListBlogCategoriesParams = {}) {
    const where = {
      ...(params.search
        ? {
            OR: [
              {
                name: {
                  contains: params.search,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: params.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
      ...(params.active !== undefined
        ? {
            active: params.active,
          }
        : {}),
    };

    const categories = await prisma.blogCategory.findMany({
      where,
      include: blogCategoryInclude,
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    return categories.map(serializeBlogCategory);
  },

  async findById(id: string) {
    const category = await prisma.blogCategory.findUnique({
      where: {
        id,
      },
      include: blogCategoryInclude,
    });

    if (!category) {
      return null;
    }

    return serializeBlogCategory(category);
  },

  async findBySlug(slug: string) {
    const category = await prisma.blogCategory.findUnique({
      where: {
        slug,
      },
      include: blogCategoryInclude,
    });

    if (!category) {
      return null;
    }

    return serializeBlogCategory(category);
  },

  async findBySlugExceptId(slug: string, id: string) {
    const category = await prisma.blogCategory.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      include: blogCategoryInclude,
    });

    if (!category) {
      return null;
    }

    return serializeBlogCategory(category);
  },

  async create(data: CreateBlogCategoryData) {
    const slug = normalizeSlug(data.name);

    const category = await prisma.blogCategory.create({
      data: {
        name: data.name,
        slug,
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
      include: blogCategoryInclude,
    });

    return serializeBlogCategory(category);
  },

  async update(id: string, data: UpdateBlogCategoryData) {
    const category = await prisma.blogCategory.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name,
            }
          : {}),
        ...(data.slug !== undefined
          ? {
              slug: data.slug,
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
      include: blogCategoryInclude,
    });

    return serializeBlogCategory(category);
  },

  async delete(id: string) {
    await prisma.blogCategory.delete({
      where: {
        id,
      },
    });
  },
};
