import { Seller } from './seller.entity';

export enum statusOffer {
  new = 'new',
  used = 'used',
  renew = 'renew',
}

export class Offer {
  id: number;

  price: number;

  stock: number;

  shipping_price: number;

  delivery_date: Date;

  can_be_refunded: boolean;

  status: string;

  guarantee: statusOffer;

  seller: Seller;
}
