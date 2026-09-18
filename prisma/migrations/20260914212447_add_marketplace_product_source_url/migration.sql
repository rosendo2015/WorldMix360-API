/*
  Warnings:

  - Added the required column `source_url` to the `marketplace_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "marketplace_products" ADD COLUMN     "source_url" TEXT NOT NULL;
