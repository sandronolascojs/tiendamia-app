-- CreateTable
CREATE TABLE "Sku" (
    "sku" TEXT NOT NULL,

    CONSTRAINT "Sku_pkey" PRIMARY KEY ("sku")
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
    "skuId" TEXT NOT NULL,
    "sellerId" INTEGER NOT NULL,

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

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "skuId" TEXT NOT NULL,
    "offerId" INTEGER[],
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "shipping_price" DECIMAL(65,30) NOT NULL,
    "delivery_date" TIMESTAMP(3) NOT NULL,
    "saleId" INTEGER NOT NULL,
    "CustomerId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "Sku"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
