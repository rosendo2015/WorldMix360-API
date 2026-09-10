import { prisma } from "@/database/prisma";

type ProductImageInput = {
  imageUrl: string;
  sortOrder?: number | undefined;
};

type CreateProductInput = {
  title: string;
  description?: string | undefined;
  shortDescription?: string | undefined;
  imageUrl: string;
  images?: ProductImageInput[] | undefined;
  price: number;
  originalPrice?: number | undefined;
  currency: string;
  rating?: number | undefined;
  reviewsCount?: number | undefined;
  affiliateUrl: string;
  subcategoryId: string;
  marketplaceId: string;
  featured?: boolean | undefined;
  available?: boolean | undefined;
  active?: boolean | undefined;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
};

type UpdateProductInput = {
  title?: string | undefined;
  description?: string | undefined;
  shortDescription?: string | undefined;
  imageUrl?: string | undefined;
  images?: ProductImageInput[] | undefined;
  price?: number | undefined;
  originalPrice?: number | undefined;
  currency?: string | undefined;
  rating?: number | undefined;
  reviewsCount?: number | undefined;
  affiliateUrl?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
  available?: boolean | undefined;
  active?: boolean | undefined;
  seoTitle?: string | undefined;
  seoDescription?: string | undefined;
};

type ProductStatusInput = {
  active?: boolean | undefined;
  available?: boolean | undefined;
  featured?: boolean | undefined;
};

type ProductQuery = {
  search?: string | undefined;
  category?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
};

type ProductAdminQuery = {
  search?: string | undefined;
  subcategoryId?: string | undefined;
  marketplaceId?: string | undefined;
  featured?: boolean | undefined;
  active?: boolean | undefined;
  available?: boolean | undefined;
};

type ProductWithRelations = {
  subcategory?: {
    name?: string;
    slug?: string;
    category?: {
      id?: string;
      name: string;
      slug?: string;
    } | null;
  } | null;
  images?: Array<{
    id: string;
    imageUrl: string;
    sortOrder: number;
  }>;
  [key: string]: unknown;
};

function serializeProduct<T extends ProductWithRelations>(product: T) {
  const { subcategory, ...productData } = product;

  return {
    ...productData,
    category: subcategory?.category?.name ?? null,
  };
}

function serializeProducts<T extends ProductWithRelations>(products: T[]) {
  return products.map(serializeProduct);
}

export const productsService = {
  async list(query: ProductQuery = {}) {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        available: true,

        ...(query.search
          ? {
              OR: [
                {
                  title: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(query.category
          ? {
              subcategory: {
                category: {
                  OR: [
                    {
                      slug: {
                        equals: query.category,
                        mode: "insensitive",
                      },
                    },
                    {
                      name: {
                        equals: query.category,
                        mode: "insensitive",
                      },
                    },
                  ],
                },
              },
            }
          : {}),

        ...(query.subcategoryId
          ? {
              subcategoryId: query.subcategoryId,
            }
          : {}),

        ...(query.marketplaceId
          ? {
              marketplaceId: query.marketplaceId,
            }
          : {}),

        ...(query.featured !== undefined
          ? {
              featured: query.featured,
            }
          : {}),
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return serializeProducts(products);
  },

  async listAdmin(query: ProductAdminQuery = {}) {
    const products = await prisma.product.findMany({
      where: {
        ...(query.search
          ? {
              OR: [
                {
                  title: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: query.search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(query.subcategoryId
          ? {
              subcategoryId: query.subcategoryId,
            }
          : {}),

        ...(query.marketplaceId
          ? {
              marketplaceId: query.marketplaceId,
            }
          : {}),

        ...(query.featured !== undefined
          ? {
              featured: query.featured,
            }
          : {}),

        ...(query.active !== undefined
          ? {
              active: query.active,
            }
          : {}),

        ...(query.available !== undefined
          ? {
              available: query.available,
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

      orderBy: {
        createdAt: "desc",
      },
    });

    return serializeProducts(products);
  },

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return serializeProduct(product);
  },

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return serializeProduct(product);
  },

  async findBySlugExceptId(slug: string, id: string) {
    return prisma.product.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    });
  },

  async create(data: CreateProductInput) {
    const slug = createProductSlug(data.title);

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug,

        ...(data.description !== undefined
          ? {
              description: data.description,
            }
          : {}),

        ...(data.shortDescription !== undefined
          ? {
              shortDescription: data.shortDescription,
            }
          : {}),

        imageUrl: data.imageUrl,

        price: data.price,

        ...(data.originalPrice !== undefined
          ? {
              originalPrice: data.originalPrice,
            }
          : {}),

        currency: data.currency,

        ...(data.rating !== undefined
          ? {
              rating: data.rating,
            }
          : {}),

        reviewsCount: data.reviewsCount ?? 0,

        affiliateUrl: data.affiliateUrl,

        available: data.available ?? true,
        featured: data.featured ?? false,
        active: data.active ?? true,

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

        ...(data.images !== undefined
          ? {
              images: {
                create: data.images.map((image, index) => ({
                  imageUrl: image.imageUrl,
                  sortOrder: image.sortOrder ?? index,
                })),
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

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return serializeProduct(product);
  },

  async update(id: string, data: UpdateProductInput) {
    const product = await prisma.$transaction(async (tx) => {
      if (data.images !== undefined) {
        await tx.productImage.deleteMany({
          where: {
            productId: id,
          },
        });
      }

      const updatedProduct = await tx.product.update({
        where: {
          id,
        },

        data: {
          ...(data.title !== undefined
            ? {
                title: data.title,
                slug: createProductSlug(data.title),
              }
            : {}),

          ...(data.description !== undefined
            ? {
                description: data.description,
              }
            : {}),

          ...(data.shortDescription !== undefined
            ? {
                shortDescription: data.shortDescription,
              }
            : {}),

          ...(data.imageUrl !== undefined
            ? {
                imageUrl: data.imageUrl,
              }
            : {}),

          ...(data.price !== undefined
            ? {
                price: data.price,
              }
            : {}),

          ...(data.originalPrice !== undefined
            ? {
                originalPrice: data.originalPrice,
              }
            : {}),

          ...(data.currency !== undefined
            ? {
                currency: data.currency,
              }
            : {}),

          ...(data.rating !== undefined
            ? {
                rating: data.rating,
              }
            : {}),

          ...(data.reviewsCount !== undefined
            ? {
                reviewsCount: data.reviewsCount,
              }
            : {}),

          ...(data.affiliateUrl !== undefined
            ? {
                affiliateUrl: data.affiliateUrl,
              }
            : {}),

          ...(data.available !== undefined
            ? {
                available: data.available,
              }
            : {}),

          ...(data.featured !== undefined
            ? {
                featured: data.featured,
              }
            : {}),

          ...(data.active !== undefined
            ? {
                active: data.active,
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

          ...(data.subcategoryId !== undefined
            ? {
                subcategory: {
                  connect: {
                    id: data.subcategoryId,
                  },
                },
              }
            : {}),

          ...(data.marketplaceId !== undefined
            ? {
                marketplace: {
                  connect: {
                    id: data.marketplaceId,
                  },
                },
              }
            : {}),

          ...(data.images !== undefined
            ? {
                images: {
                  create: data.images.map((image, index) => ({
                    imageUrl: image.imageUrl,
                    sortOrder: image.sortOrder ?? index,
                  })),
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

          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

      return updatedProduct;
    });

    return serializeProduct(product);
  },

  async updateStatus(id: string, data: ProductStatusInput) {
    const product = await prisma.product.update({
      where: {
        id,
      },

      data: {
        ...(data.active !== undefined
          ? {
              active: data.active,
            }
          : {}),

        ...(data.available !== undefined
          ? {
              available: data.available,
            }
          : {}),

        ...(data.featured !== undefined
          ? {
              featured: data.featured,
            }
          : {}),
      },

      include: {
        subcategory: {
          include: {
            category: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return serializeProduct(product);
  },
};

function createProductSlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
