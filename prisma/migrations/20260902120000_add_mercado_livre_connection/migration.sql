-- CreateTable
CREATE TABLE "mercado_livre_connection" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "seller_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mercado_livre_connection_pkey" PRIMARY KEY ("id")
);