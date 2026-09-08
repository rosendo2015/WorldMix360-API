import { prisma } from "@/database/prisma";
import { createSlug } from "@/utils/createSlug";

export const productsService = {
  // Lista pública de produtos
  async list(filters: {
    search?: string | undefined;
    subcategoryId?: string | undefined;
    marketplaceId?: string | undefined;
    featured?: boolean | undefined;
  }) {
    return prisma.product.findMany({
      where: {
        available: true,

        ...(filters.subcategoryId
          ? { subcategoryId: filters.subcategoryId }
          : {}),

        ...(filters.marketplaceId
          ? { marketplaceId: filters.marketplaceId }
          : {}),

        ...(filters.featured !== undefined
          ? { featured: filters.featured }
          : {}),

        ...(filters.search
          ? {
              title: {
                contains: filters.search,
                mode: "insensitive",
              },
            }
          : {}),
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },

      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    });
  },

  // Lista administrativa de produtos
  // Retorna produtos disponíveis e indisponíveis.
  async listAdmin(filters: {
    search?: string | undefined;
    subcategoryId?: string | undefined;
    marketplaceId?: string | undefined;
    featured?: boolean | undefined;
    active?: boolean | undefined;
    available?: boolean | undefined;
  }) {
    return prisma.product.findMany({
      where: {
        ...(filters.subcategoryId
          ? { subcategoryId: filters.subcategoryId }
          : {}),

        ...(filters.marketplaceId
          ? { marketplaceId: filters.marketplaceId }
          : {}),

        ...(filters.featured !== undefined
          ? { featured: filters.featured }
          : {}),

        ...(filters.active !== undefined ? { active: filters.active } : {}),

        ...(filters.available !== undefined
          ? { available: filters.available }
          : {}),

        ...(filters.search
          ? {
              title: {
                contains: filters.search,
                mode: "insensitive",
              },
            }
          : {}),
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        marketplace: true,

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },

      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    });
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });
  },

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });
  },

  async findBySlugExceptId(slug: string, id: string) {
    return prisma.product.findFirst({
      where: {
        slug,
        id: {
          not: id,
        },
      },
    });
  },

  async create(data: any) {
    const slug = createSlug(data.title);

    return prisma.product.create({
      data: {
        title: data.title,
        slug,
        description: data.description ?? null,
        shortDescription: data.shortDescription ?? null,
        imageUrl: data.imageUrl,
        price: data.price,
        originalPrice: data.originalPrice ?? null,
        currency: data.currency,
        rating: data.rating ?? null,
        reviewsCount: data.reviewsCount,
        affiliateUrl: data.affiliateUrl,

        featured: data.featured,
        available: data.available,
        active: data.active,

        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,

        subcategory: {
          connect: {
            id: data.subcategoryId,
          },
        },

        marketplace: {
          connect: {
            id: data.marketplaceId,
          },
        },

        ...(data.images?.length
          ? {
              images: {
                create: data.images.map(
                  (
                    image: {
                      imageUrl: string;
                      sortOrder?: number;
                    },
                    index: number,
                  ) => ({
                    imageUrl: image.imageUrl,
                    sortOrder: image.sortOrder ?? index,
                  }),
                ),
              },
            }
          : {}),
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.$transaction(async (tx) => {
      if (data.images !== undefined) {
        await tx.productImage.deleteMany({
          where: {
            productId: id,
          },
        });
      }

      return tx.product.update({
        where: { id },

        data: {
          ...(data.title !== undefined
            ? {
                title: data.title,
                slug: createSlug(data.title),
              }
            : {}),

          ...(data.description !== undefined
            ? { description: data.description }
            : {}),

          ...(data.shortDescription !== undefined
            ? { shortDescription: data.shortDescription }
            : {}),

          ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),

          ...(data.price !== undefined ? { price: data.price } : {}),

          ...(data.originalPrice !== undefined
            ? { originalPrice: data.originalPrice }
            : {}),

          ...(data.currency !== undefined ? { currency: data.currency } : {}),

          ...(data.rating !== undefined ? { rating: data.rating } : {}),

          ...(data.reviewsCount !== undefined
            ? { reviewsCount: data.reviewsCount }
            : {}),

          ...(data.affiliateUrl !== undefined
            ? { affiliateUrl: data.affiliateUrl }
            : {}),

          ...(data.featured !== undefined ? { featured: data.featured } : {}),

          ...(data.available !== undefined
            ? { available: data.available }
            : {}),

          ...(data.active !== undefined ? { active: data.active } : {}),

          ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),

          ...(data.seoDescription !== undefined
            ? { seoDescription: data.seoDescription }
            : {}),

          ...(data.subcategoryId
            ? {
                subcategory: {
                  connect: {
                    id: data.subcategoryId,
                  },
                },
              }
            : {}),

          ...(data.marketplaceId
            ? {
                marketplace: {
                  connect: {
                    id: data.marketplaceId,
                  },
                },
              }
            : {}),

          ...(data.images !== undefined && data.images.length > 0
            ? {
                images: {
                  create: data.images.map(
                    (
                      image: {
                        imageUrl: string;
                        sortOrder?: number;
                      },
                      index: number,
                    ) => ({
                      imageUrl: image.imageUrl,
                      sortOrder: image.sortOrder ?? index,
                    }),
                  ),
                },
              }
            : {}),
        },

        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });
    });
  },

  async updateStatus(
    id: string,
    data: {
      active?: boolean | undefined;
      available?: boolean | undefined;
      featured?: boolean | undefined;
    },
  ) {
    return prisma.product.update({
      where: { id },

      data: {
        ...(data.active !== undefined ? { active: data.active } : {}),

        ...(data.available !== undefined ? { available: data.available } : {}),

        ...(data.featured !== undefined ? { featured: data.featured } : {}),
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });
  },
};
