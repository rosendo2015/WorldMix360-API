import { prisma } from "@/database/prisma";

export const marketplaceService = {
  async create(data: any) {
    return prisma.marketplace.create({ data });
  },

  async list() {
    return prisma.marketplace.findMany({
      include: { products: true },
    });
  },

  async get(id: string) {
    return prisma.marketplace.findUnique({
      where: { id },
      include: { products: true },
    });
  },

  async update(id: string, data: any) {
    return prisma.marketplace.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.marketplace.delete({ where: { id } });
  },
};
