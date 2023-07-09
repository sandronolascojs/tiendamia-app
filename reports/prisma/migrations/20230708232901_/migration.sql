/*
  Warnings:

  - You are about to drop the column `saleId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Sale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "saleId",
ADD COLUMN     "productsId" INTEGER[];

-- DropTable
DROP TABLE "Sale";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "skuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "offerId" INTEGER[],
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
