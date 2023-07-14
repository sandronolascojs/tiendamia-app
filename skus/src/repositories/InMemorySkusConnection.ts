import { Injectable, NotFoundException } from '@nestjs/common';
import { Sku } from 'src/entities/sku.entity';
import { IConnection } from 'src/shared/interfaces/IConnection';
import { typeId } from 'src/shared/interfaces/typeId';

@Injectable()
export class InMemorySkusConnection implements IConnection<Sku> {
  private readonly skus: Sku[] = [];

  async create(entity: Sku): Promise<void> {
    this.skus.push(entity);
  }
  async update(id: typeId<number, string>, entity: Sku): Promise<Sku> {
    const sku = this.skus.find((sku) => sku.sku === id);

    if (!sku) {
      throw new NotFoundException(`Sku ${entity.sku} not found`);
    }

    sku.offers = entity.offers;

    return sku;
  }

  async delete(id: typeId<number, string>): Promise<void> {
    const sku = this.skus.find((sku) => sku.sku === id);

    if (!sku) {
      throw new NotFoundException(`Sku ${id} not found`);
    }

    const index = this.skus.indexOf(sku);

    this.skus.splice(index, 1);
  }
  async findAll(): Promise<Sku[]> {
    return this.skus;
  }

  async findById(id: typeId<number, string>): Promise<Sku> {
    const sku = this.skus.find((sku) => sku.sku === id);
    if (!sku) {
      throw new NotFoundException(`Sku ${id} not found`);
    }

    return sku;
  }
  async exists(id: typeId<number, string>): Promise<boolean> {
    const sku = this.skus.find((sku) => sku.sku === id);

    if (!sku) {
      return false;
    }

    return true;
  }
}
