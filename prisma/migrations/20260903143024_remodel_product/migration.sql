/*
  Warnings:

  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - A unique constraint covering the columns `[slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[external_id,marketplace]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketplace` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'BRL',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "external_id" TEXT NOT NULL,
ADD COLUMN     "marketplace" TEXT NOT NULL,
ADD COLUMN     "original_price" DECIMAL(12,2),
ADD COLUMN     "rating" DECIMAL(3,2),
ADD COLUMN     "reviews_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "seo_description" TEXT,
ADD COLUMN     "seo_title" TEXT,
ADD COLUMN     "short_description" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "synced_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_marketplace_idx" ON "products"("marketplace");

-- CreateIndex
CREATE INDEX "products_active_idx" ON "products"("active");

-- CreateIndex
CREATE INDEX "products_featured_idx" ON "products"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "products_external_id_marketplace_key" ON "products"("external_id", "marketplace");
