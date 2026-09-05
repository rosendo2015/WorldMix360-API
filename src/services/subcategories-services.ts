import { prisma } from "@/database/prisma";

export const subcategoriesService = {
  async create(data: any) {
    return prisma.subcategory.create({
      data,
    });
  },

  async list() {
    return prisma.subcategory.findMany({
      include: {
        category: true,
        products: true,
      },
    });
  },

  async get(id: string) {
    return prisma.subcategory.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        products: true,
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.subcategory.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.subcategory.delete({
      where: {
        id,
      },
    });
  },
};
