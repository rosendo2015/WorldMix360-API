-- CreateEnum
CREATE TYPE "MarketplaceProductSyncStatus" AS ENUM ('PENDING', 'SYNCING', 'SUCCESS', 'ERROR');

-- CreateTable
CREATE TABLE "marketplace_products" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "marketplace_id" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "affiliate_url" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "original_price" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "rating" DECIMAL(3,2),
    "reviews_count" INTEGER NOT NULL DEFAULT 0,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "sync_status" "MarketplaceProductSyncStatus" NOT NULL DEFAULT 'PENDING',
    "last_synced_at" TIMESTAMP(3),
    "last_sync_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "marketplace_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "marketplace_products_product_id_idx" ON "marketplace_products"("product_id");

-- CreateIndex
CREATE INDEX "marketplace_products_marketplace_id_idx" ON "marketplace_products"("marketplace_id");

-- CreateIndex
CREATE INDEX "marketplace_products_external_id_idx" ON "marketplace_products"("external_id");

-- CreateIndex
CREATE INDEX "marketplace_products_available_idx" ON "marketplace_products"("available");

-- CreateIndex
CREATE INDEX "marketplace_products_sync_status_idx" ON "marketplace_products"("sync_status");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_products_product_id_marketplace_id_key" ON "marketplace_products"("product_id", "marketplace_id");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_products_external_id_marketplace_id_key" ON "marketplace_products"("external_id", "marketplace_id");

-- AddForeignKey
ALTER TABLE "marketplace_products" ADD CONSTRAINT "marketplace_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_products" ADD CONSTRAINT "marketplace_products_marketplace_id_fkey" FOREIGN KEY ("marketplace_id") REFERENCES "marketplaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
