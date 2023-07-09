import { Offer } from './offer.entity';

export class Sku {
  id: string;

  name: string;

  description: string;

  offers: Offer[];

  createdAt: Date;

  updatedAt: Date;

  disabledAt: Date | null;
}
