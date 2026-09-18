-- AlterTable
ALTER TABLE "marketplace_products" ADD COLUMN     "external_link" TEXT;

-- CreateIndex
CREATE INDEX "marketplace_products_external_link_idx" ON "marketplace_products"("external_link");
