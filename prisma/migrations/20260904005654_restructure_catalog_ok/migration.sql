/*
  Warnings:

  - You are about to drop the column `category_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `seo_description` on the `products` table. All the data in the column will be lost.
  - Made the column `marketplace_id` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subcategory_id` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_category_id_fkey";

-- DropIndex
DROP INDEX "products_category_id_idx";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "marketplaces" ADD COLUMN     "description" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "mercado_livre_connection" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "category_id",
DROP COLUMN "seo_description",
ADD COLUMN     "seoDescription" TEXT,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "marketplace_id" SET NOT NULL,
ALTER COLUMN "subcategory_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "subcategories" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "categories_sort_order_idx" ON "categories"("sort_order");

-- CreateIndex
CREATE INDEX "marketplaces_sort_order_idx" ON "marketplaces"("sort_order");

-- CreateIndex
CREATE INDEX "subcategories_sort_order_idx" ON "subcategories"("sort_order");
