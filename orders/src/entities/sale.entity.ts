import { randomUUID } from 'node:crypto';
import { Sale as SalePersistence } from '@prisma/client';

export class Sale {
  id: string;
  sku: string;
  offerId: number;
  quantity: number;
  price: number;
  total: number;
  status: string;
  shippingPrice: number;
  seller: string;
  sale_date: string;
  createdAt: Date;
  updatedAt: Date;

  private constructor(sale: Sale) {
    this.id = sale.id ?? randomUUID();
    this.sku = sale.sku;
    this.offerId = sale.offerId;
    this.quantity = sale.quantity;
    this.price = sale.price;
    this.total = sale.total;
    this.status = sale.status ?? 'CREATED';
    this.shippingPrice = sale.shippingPrice;
    this.seller = sale.seller;
    this.sale_date = sale.sale_date;
    this.createdAt = sale.createdAt ?? new Date();
    this.updatedAt = sale.updatedAt ?? new Date();
  }

  static create({
    sku,
    offerId,
    price,
    quantity,
    shippingPrice,
    total,
    seller,
    sale_date,
    status,
    createdAt,
    updatedAt,
    id,
  }: {
    sku: string;
    offerId: number;
    price: number;
    quantity: number;
    shippingPrice: number;
    total: number;
    seller: string;
    sale_date: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    id?: string;
  }): Sale {
    return new Sale({
      id,
      sku,
      offerId,
      quantity,
      price,
      total,
      status,
      shippingPrice,
      seller,
      sale_date,
      createdAt,
      updatedAt,
    });
  }

  static fromPersistence(sale: SalePersistence): Sale {
    return new Sale({
      id: sale.id,
      sku: sale.sku,
      offerId: sale.offer_id,
      quantity: sale.quantity,
      price: Number(sale.price),
      total: Number(sale.total),
      status: sale.status,
      shippingPrice: Number(sale.shipping_price),
      seller: sale.seller,
      sale_date: sale.sale_date,
      createdAt: sale.created_at,
      updatedAt: sale.updated_at,
    });
  }
}
