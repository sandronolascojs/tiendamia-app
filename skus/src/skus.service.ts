import { Inject, Injectable } from '@nestjs/common';
import { Sku } from './entities/sku.entity';
import { repositories } from './shared/constants/repositories.constants';
import { Offer } from './entities/offer.entity';
import { ISkuRepository } from './interfaces/ISkuRepository';

@Injectable()
export class SkusService {
  constructor(
    @Inject(repositories.SkusRepository)
    private repository: ISkuRepository<Sku>,
  ) {}

  async create(sku: Sku): Promise<void> {
    await this.repository.create(sku);
  }

  async update(id: string, sku: Sku): Promise<Sku> {
    return await this.repository.update(id, sku);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Sku[]> {
    return await this.repository.findAll();
  }

  async findById(id: string): Promise<Sku> {
    console.log(await this.repository.findById(id));
    return await this.repository.findById(id);
  }

  async exists(id: string): Promise<boolean> {
    return await this.repository.exists(id);
  }

  async findBestOfferBySkuId(skuId: string): Promise<Offer> {
    return await this.repository.findBestOfferBySkuId(skuId);
  }

  async findOffersBySkuId(skuId: string): Promise<Offer[]> {
    return await this.repository.findOffersBySkuId(skuId);
  }

  async findBestOffersBySkuId(skuId: string, limit: number): Promise<Offer[]> {
    return await this.repository.findBestOffersBySkuId(skuId, limit);
  }
}
