import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ISkuRepository } from './interfaces/ISkuRepository';
import { Sku } from './entities/sku.entity';
import { ClientProxy } from '@nestjs/microservices';
import { repositories } from './shared/constants/repositories.constants';
import { CreateSaleDto } from './dtos/createSale.dto';

@Injectable()
export class SalesService {
  constructor(
    @Inject(repositories.SkusRepository)
    private readonly skusRepository: ISkuRepository<Sku>,
    @Inject('SALES_SERVICE') private readonly client: ClientProxy,
  ) {}

  async createSale({ skuId, offerId, quantity }: CreateSaleDto) {
    const offer = await this.skusRepository.findOfferBySkuIdAndOfferId(
      skuId,
      offerId,
    );
    const offerHasStock = offer.stock >= quantity;
    if (!offerHasStock)
      throw new BadRequestException('Not enough stock for this offer');
    await this.skusRepository.reduceStockBySkuIdAndOfferId(
      skuId,
      offerId,
      quantity,
    );
    const saleMetadata = {
      sku: skuId,
      offerId: offerId,
      quantity: quantity,
      price: offer.price,
      total: offer.price * quantity + offer.shipping_price,
      shippingPrice: offer.shipping_price,
      seller: offer.seller.name,
      sale_date: new Date().toISOString().split('T')[0],
    };
    this.client.emit('sale_created', saleMetadata);
  }
}
