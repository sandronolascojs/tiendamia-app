import { Seller } from './seller.entity';
import { Sku } from './sku.entity';

enum statusOffer {
  new = 'new',
  used = 'used',
  renew = 'renew',
}

export class Offer {
  id: string;

  price: number;

  stock: number;

  shippingPrice: number;

  deliveryDate: Date;

  canBeRefunded: boolean;

  status: string;

  guarantee: boolean;

  sku: Sku;

  seller: Seller;

  createdAt: Date;

  updatedAt: Date;
}
