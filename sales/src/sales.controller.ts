import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async createSale(@Body() saleData: any) {
    // Aquí puedes validar y procesar los datos de la venta antes de guardarlos en la base de datos

    const createdSale = await this.prisma.offer.create({
      data: saleData,
    });

    return createdSale;
  }

  @Get(':sku')
  async getSalesBySKU(@Param('sku') sku: string) {
    const sales = await this.prisma.sKU.findMany({
      where: { sku: sku },
      include: {
        offers: {
          include: {
            seller: true,
          },
        },
      },
    });

    return sales;
  }
}
