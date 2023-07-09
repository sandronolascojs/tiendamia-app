import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clean() {
  try {
    await prisma.$transaction([
      prisma.offer.deleteMany(),
      prisma.product.deleteMany(),
      prisma.seller.deleteMany(),
      prisma.sKU.deleteMany(),
    ]);
  } catch (error) {
    console.error('Error cleaning the database:', error);
  }
}

clean();
