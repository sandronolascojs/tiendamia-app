import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma.service';
import { Sale } from 'src/entities/sale.entity';
import { IConnection } from 'src/shared/interfaces/IConnection';
import { typeId } from 'src/shared/interfaces/typeId';

@Injectable()
export class PostgresConnection implements IConnection<Sale> {
  constructor(private readonly prisma: PrismaService) {}
  async create(entity: Sale): Promise<void> {
    await this.prisma.sale.create({
      data: {
        id: entity.id,
        sku: entity.sku,
        offer_id: entity.offerId,
        quantity: entity.quantity,
        price: entity.price,
        total: entity.total,
        shipping_price: entity.shippingPrice,
        seller: entity.seller,
        status: entity.status,
        sale_date: entity.sale_date,
        created_at: entity.createdAt,
        updated_at: entity.updatedAt,
      },
    });
  }
  async update(id: typeId, entity: Sale): Promise<Sale> {
    const sale = await this.prisma.sale.update({
      where: { id: String(id) },
      data: {
        sku: entity.sku,
        offer_id: entity.offerId,
        quantity: entity.quantity,
        price: entity.price,
        total: entity.total,
        shipping_price: entity.shippingPrice,
        seller: entity.seller,
        status: entity.status,
        sale_date: entity.sale_date,
        created_at: entity.createdAt,
        updated_at: entity.updatedAt,
      },
    });

    if (!sale) throw new NotFoundException('order not found');

    return Sale.fromPersistence(sale);
  }
  async delete(id: typeId): Promise<void> {
    await this.prisma.sale.delete({ where: { id: String(id) } });
  }
  async findAll(): Promise<Sale[]> {
    const sales = await this.prisma.sale.findMany();
    if (sales.length === 0) throw new NotFoundException('orders not found');
    return sales.map((sale) => Sale.fromPersistence(sale));
  }
  async findById(id: typeId): Promise<Sale> {
    const sale = await this.prisma.sale.findUnique({
      where: { id: String(id) },
    });

    if (!sale) throw new NotFoundException('order not found');
    return Sale.fromPersistence(sale);
  }
  async exists(id: typeId): Promise<boolean> {
    const sale = await this.prisma.sale.findUnique({
      where: { id: String(id) },
    });
    return !!sale;
  }

  async findSalesBySkuId(skuId: string): Promise<Sale[]> {
    const sales = await this.prisma.sale.findMany({
      where: { sku: skuId },
    });

    if (sales.length === 0)
      throw new NotFoundException('Sales not found for this sku');
    return sales.map((sale) => Sale.fromPersistence(sale));
  }

  async generateDailyReport() {
    const todayDateFormatted = new Date().toISOString().split('T')[0];
    const sales = await this.prisma.sale.findMany({
      where: {
        sale_date: todayDateFormatted,
      },
    });
    return sales.map((sale) => Sale.fromPersistence(sale));
  }

  async generateReportByDate(date: string) {
    const sales = await this.prisma.sale.findMany({
      where: {
        sale_date: date,
      },
    });

    if (sales.length === 0)
      throw new NotFoundException('orders not found for this date');
    return sales.map((sale) => Sale.fromPersistence(sale));
  }
}
