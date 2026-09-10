import { prisma } from "@/database/prisma";

export const searchService = {
  async search(query: string) {
    const search = query.trim();

    if (!search) {
      return {
        products: [],
        categories: [],
        subcategories: [],
      };
    }

    const [products, categories, subcategories] = await Promise.all([
      prisma.product.findMany({
        where: {
          active: true,
          available: true,
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              shortDescription: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              subcategory: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              subcategory: {
                category: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
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
        take: 20,
      }),

      prisma.category.findMany({
        where: {
          active: true,
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 20,
      }),

      prisma.subcategory.findMany({
        where: {
          active: true,
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          category: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 20,
      }),
    ]);

    return {
      products: products.map((product) => {
        const { subcategory, ...productData } = product;

        return {
          ...productData,
          category: subcategory?.category?.name ?? null,
        };
      }),

      categories,

      subcategories,
    };
  },
};
