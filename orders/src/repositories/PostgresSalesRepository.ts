import { Injectable } from '@nestjs/common';
import { Sale } from 'src/entities/sale.entity';
import { ISalesRepository } from 'src/interfaces/ISkuRepository';
import { typeId } from 'src/shared/interfaces/typeId';
import { PostgresConnection } from './PostgresConnection';

@Injectable()
export class PostgresSalesRepository implements ISalesRepository<Sale> {
  constructor(private readonly connection: PostgresConnection) {}
  async findSalesBySkuId(skuId: string): Promise<Sale[]> {
    return await this.connection.findSalesBySkuId(skuId);
  }

  async generateDailyReport(): Promise<Sale[]> {
    return await this.connection.generateDailyReport();
  }

  async generateReportByDate(date: string): Promise<Sale[]> {
    return await this.connection.generateReportByDate(date);
  }

  async create(entity: Sale): Promise<void> {
    await this.connection.create(entity);
  }

  async update(id: typeId, entity: Sale): Promise<Sale> {
    return await this.connection.update(id, entity);
  }

  async delete(id: typeId): Promise<void> {
    await this.connection.delete(id);
  }

  async findAll(): Promise<Sale[]> {
    return await this.connection.findAll();
  }

  async findById(id: typeId): Promise<Sale> {
    return await this.connection.findById(id);
  }

  async exists(id: typeId): Promise<boolean> {
    return await this.connection.exists(id);
  }
}
