UPDATE "products"
SET "destaque" = TRUE
WHERE "featured" = TRUE;

DROP INDEX IF EXISTS "products_featured_idx";

ALTER TABLE "products"
DROP COLUMN "featured";
