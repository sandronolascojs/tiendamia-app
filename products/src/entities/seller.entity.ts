import { Offer } from './offer.entity';

export class Seller {
  id: string;

  name: string;

  qualification: number;

  reviewsQuantity: number;

  offers: Offer[];

  createdAt: Date;

  updatedAt: Date;

  disabledAt: Date | null;
}
