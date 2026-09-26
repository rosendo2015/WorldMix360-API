-- AlterTable
ALTER TABLE "products" ADD COLUMN     "bestSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "destaque" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "products_destaque_idx" ON "products"("destaque");

-- CreateIndex
CREATE INDEX "products_bestSeller_idx" ON "products"("bestSeller");
