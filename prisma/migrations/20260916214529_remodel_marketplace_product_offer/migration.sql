/*
  Warnings:

  - You are about to drop the column `source_url` on the `marketplace_products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[marketplace_id,item_id,seller_id]` on the table `marketplace_products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "MarketplaceProductSyncStatus" ADD VALUE 'UNAVAILABLE';

-- AlterTable
ALTER TABLE "marketplace_products" DROP COLUMN "source_url",
ADD COLUMN     "catalog_product_id" TEXT,
ADD COLUMN     "item_id" TEXT,
ADD COLUMN     "seller_id" TEXT;

-- CreateIndex
CREATE INDEX "marketplace_products_catalog_product_id_idx" ON "marketplace_products"("catalog_product_id");

-- CreateIndex
CREATE INDEX "marketplace_products_item_id_idx" ON "marketplace_products"("item_id");

-- CreateIndex
CREATE INDEX "marketplace_products_seller_id_idx" ON "marketplace_products"("seller_id");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_products_marketplace_id_item_id_seller_id_key" ON "marketplace_products"("marketplace_id", "item_id", "seller_id");
