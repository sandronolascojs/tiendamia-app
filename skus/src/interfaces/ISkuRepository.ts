import { Offer } from 'src/entities/offer.entity';
import { IRepository } from 'src/shared/interfaces/IRepository';

export interface ISkuRepository<Sku> extends IRepository<Sku> {
  findBestOfferBySkuId(skuId: string): Promise<Offer>;
  findOffersBySkuId(skuId: string): Promise<Offer[]>;
  findBestOffersBySkuId(skuId: string, limit: number): Promise<Offer[]>;
  findOfferBySkuIdAndOfferId(skuId: string, offerId: number): Promise<Offer>;
  reduceStockBySkuIdAndOfferId(
    skuId: string,
    offerId: number,
    quantity: number,
  ): Promise<void>;
}
