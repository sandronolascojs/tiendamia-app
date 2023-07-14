import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomArrayElement<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

async function generateSeed() {
  const seed = {
    SKUs: [],
    products: [],
    sellers: [],
  };

  // Generar datos para el modelo SKU
  for (let i = 0; i < 10; i++) {
    const sku = {
      sku: `${faker.company.buzzNoun()}-${randomIntFromInterval(1000, 9999)}`,
    };
    const createdSKU = await prisma.sKU.create({ data: sku });
    seed.SKUs.push(createdSKU);
  }

  // Generar datos para el modelo Product
  for (let i = 0; i < 10; i++) {
    const product = {
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      image: faker.image.urlPicsumPhotos({ width: 500, height: 500 }),
    };
    const createdProduct = await prisma.product.create({ data: product });
    seed.products.push(createdProduct);
  }

  // Generar datos para el modelo Seller
  for (let i = 0; i < 5; i++) {
    const seller = {
      name: faker.company.name(),
      qualification: randomIntFromInterval(1, 5),
      reviews_quantity: randomIntFromInterval(0, 100),
    };
    const createdSeller = await prisma.seller.create({ data: seller });
    seed.sellers.push(createdSeller);
  }

  // Generar datos para el modelo Offer
  for (let i = 0; i < 20; i++) {
    const product = getRandomArrayElement(seed.products);
    const seller = getRandomArrayElement(seed.sellers);
    const sku = getRandomArrayElement(seed.SKUs);

    const offer = {
      price: randomIntFromInterval(10, 9999),
      stock: randomIntFromInterval(0, 100),
      shipping_price: randomIntFromInterval(0, 25),
      delivery_date: faker.date.future(),
      can_be_refunded: faker.datatype.boolean(),
      status: 'new',
      guarantee: faker.datatype.boolean(),
      product: { connect: { id: product.id } },
      seller: { connect: { id: seller.id } },
      SKU: { connect: { id: sku.id } },
    };

    await prisma.offer.create({ data: offer });
  }

  return seed;
}

async function seedDatabase() {
  const seedData = await generateSeed();
  console.log('Data generated:', seedData);
  await prisma.$disconnect();
}

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
