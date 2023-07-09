-- CreateTable
CREATE TABLE "SKU" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,

    CONSTRAINT "SKU_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL,
    "shipping_price" DECIMAL(65,30) NOT NULL,
    "delivery_date" TIMESTAMP(3) NOT NULL,
    "can_be_refunded" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "guarantee" BOOLEAN NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "sKUId" INTEGER,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "qualification" INTEGER NOT NULL,
    "reviews_quantity" INTEGER NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_sKUId_fkey" FOREIGN KEY ("sKUId") REFERENCES "SKU"("id") ON DELETE SET NULL ON UPDATE CASCADE;
