/*
  Warnings:

  - You are about to drop the `Offer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Seller` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sku]` on the table `SKU` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_sKUId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_sellerId_fkey";

-- DropTable
DROP TABLE "Offer";

-- DropTable
DROP TABLE "Seller";

-- CreateTable
CREATE TABLE "offers" (
    "id" SERIAL NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL,
    "shipping_price" DECIMAL(65,30) NOT NULL,
    "delivery_date" TIMESTAMP(3) NOT NULL,
    "can_be_refunded" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "guarantee" BOOLEAN NOT NULL,
    "productId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "sKUId" INTEGER,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "qualification" INTEGER NOT NULL,
    "reviews_quantity" INTEGER NOT NULL,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SKU_sku_key" ON "SKU"("sku");

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_sKUId_fkey" FOREIGN KEY ("sKUId") REFERENCES "SKU"("id") ON DELETE SET NULL ON UPDATE CASCADE;
