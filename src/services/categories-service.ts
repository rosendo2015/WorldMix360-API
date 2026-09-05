import { prisma } from "@/database/prisma";

export const categoryService = {
  async create(data: any) {
    return prisma.category.create({
      data,
    });
  },

  async list() {
    return prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
  },

  async get(id: string) {
    return prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        subcategories: true,
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.category.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.category.delete({
      where: {
        id,
      },
    });
  },
};
