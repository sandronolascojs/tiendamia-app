import { Sku } from 'src/entities/sku.entity';
import { InFileSkusConnection } from './InFileSkusConnection';
import { AbstractRepository } from 'src/shared/classes/AbstractRepository';
import { Injectable } from '@nestjs/common';
import { Offer } from 'src/entities/offer.entity';
import { ISkuRepository } from 'src/interfaces/ISkuRepository';

@Injectable()
export class InFileSkusRepository
  extends AbstractRepository<Sku>
  implements ISkuRepository<Sku>
{
  constructor(protected readonly connection: InFileSkusConnection) {
    super(connection);
  }

  async findBestOfferBySkuId(skuId: string): Promise<Offer> {
    return await this.connection.findBestOfferBySkuId(skuId);
  }

  async findOffersBySkuId(skuId: string): Promise<Offer[]> {
    return await this.connection.findOffersBySkuId(skuId);
  }

  async findBestOffersBySkuId(skuId: string, limit: number): Promise<Offer[]> {
    return await this.connection.findBestOffersBySkuId(skuId, limit);
  }

  async findOfferBySkuIdAndOfferId(
    skuId: string,
    offerId: number,
  ): Promise<Offer> {
    return await this.connection.findOfferBySkuIdAndOfferId(skuId, offerId);
  }

  async reduceStockBySkuIdAndOfferId(
    skuId: string,
    offerId: number,
    quantity: number,
  ): Promise<void> {
    return await this.connection.reduceStockBySkuIdAndOfferId(
      skuId,
      offerId,
      quantity,
    );
  }
}
