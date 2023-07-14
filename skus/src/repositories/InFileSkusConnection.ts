import { resolve, join } from 'node:path';
import { existsSync, createWriteStream, createReadStream } from 'node:fs';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Sku } from 'src/entities/sku.entity';
import { IConnection } from 'src/shared/interfaces/IConnection';
import { typeId } from 'src/shared/interfaces/typeId';
import { Offer } from 'src/entities/offer.entity';

interface Data {
  skus: Sku[];
}

@Injectable()
export class InFileSkusConnection implements IConnection<Sku> {
  private filePath = null;

  constructor(
    @Inject('DATA_PATH')
    filePath: string,
  ) {
    this.filePath = this.findDataFile(filePath);
  }

  async create(entity: Sku): Promise<void> {
    const data = await this.readData();
    data.skus.push(entity);
    await this.writeData(data);
  }

  async update(id: typeId<number, string>, entity: Sku): Promise<Sku> {
    const data = await this.readData();
    const sku = data.skus.find((sku) => sku.sku === id);
    if (sku) {
      Object.assign(sku, entity);
      await this.writeData(data);
      return sku;
    } else {
      throw new Error('Sku not found');
    }
  }

  async delete(id: typeId<number, string>): Promise<void> {
    const data = await this.readData();
    const index = data.skus.findIndex((sku) => sku.sku === id);
    if (index !== -1) {
      data.skus.splice(index, 1);
      await this.writeData(data);
    } else {
      throw new Error('Sku not found');
    }
  }

  async findAll(): Promise<Sku[]> {
    const data = await this.readData();
    return data.skus;
  }

  async findById(id: typeId<number, string>): Promise<Sku> {
    const data = await this.readData();
    const sku = data.skus.find((sku) => sku.sku === id);
    if (!sku) throw new NotFoundException('Sku not found');
    return sku;
  }

  async exists(id: typeId<number, string>): Promise<boolean> {
    const data = await this.readData();
    return data.skus.some((sku) => sku.sku === id);
  }

  async findOffersBySkuId(id: typeId<number, string>): Promise<Offer[]> {
    const data = await this.readData();
    const sku = data.skus.find((sku) => sku.sku === id);
    if (!sku) throw new NotFoundException('Sku not found');
    return sku.offers;
  }

  async findOfferBySkuIdAndOfferId(
    id: typeId<number, string>,
    offerId: number,
  ): Promise<Offer> {
    const data = await this.readData();
    const sku = data.skus.find((sku) => sku.sku === id);
    if (!sku) throw new NotFoundException('Sku not found');
    const offer = sku.offers.find((offer) => offer.id === offerId);
    if (!offer) throw new NotFoundException('Offer not found');
    return offer;
  }

  async findBestOfferBySkuId(id: typeId<number, string>): Promise<Offer> {
    const data = await this.readData();
    const sku = data.skus.find((sku) => sku.sku === id);
    if (!sku) throw new NotFoundException('Sku not found');

    const offers = sku.offers.filter((offer) => offer.stock > 0);
    if (offers.length === 0) throw new NotFoundException('No offers found');

    let bestOffer: Offer | undefined;
    let bestPriceShipping: number | undefined;

    for (const offer of offers) {
      const isNewProducer = offer.status === 'new';
      const isQualifiedSeller =
        offer.seller.qualification >= 4 && offer.seller.reviews_quantity > 0;

      if (
        (isNewProducer && isQualifiedSeller) ||
        (!bestOffer && isQualifiedSeller)
      ) {
        const priceShipping = offer.price + offer.shipping_price;

        if (!bestOffer || priceShipping < bestPriceShipping) {
          bestOffer = offer;
          bestPriceShipping = priceShipping;
        }
      }
    }

    if (!bestOffer) {
      offers.sort(
        (a, b) => a.price + a.shipping_price - (b.price + b.shipping_price),
      );
      bestOffer = offers[0];
    }

    return bestOffer;
  }

  async findBestOffersBySkuId(
    id: typeId<number, string>,
    limit: number,
  ): Promise<Offer[]> {
    const data = await this.readData();
    const sku = data.skus.find((sku) => sku.sku === id);
    if (!sku) throw new NotFoundException('Sku not found');

    const offers = sku.offers.filter((offer) => offer.stock > 0);
    if (offers.length === 0) throw new NotFoundException('No offers found');

    const qualifiedOffers = offers.filter((offer) => {
      const isNewProducer = offer.status === 'new';
      const isQualifiedSeller =
        offer.seller.qualification >= 4 && offer.seller.reviews_quantity > 0;
      return isNewProducer || isQualifiedSeller;
    });

    if (qualifiedOffers.length === 0)
      throw new NotFoundException('No qualified offers found');

    const sortedOffers = qualifiedOffers.sort(
      (a, b) => a.price + a.shipping_price - (b.price + b.shipping_price),
    );

    return sortedOffers.slice(0, limit);
  }

  async reduceStockBySkuIdAndOfferId(
    skuId: string,
    offerId: number,
    quantity: number,
  ): Promise<void> {
    const data = await this.readData();
    const sku = data.skus.find((sku) => sku.sku === skuId);
    if (!sku) throw new NotFoundException('Sku not found');
    const offer = sku.offers.find((offer) => offer.id === offerId);
    if (!offer) throw new NotFoundException('Offer not found');
    if (offer.stock < quantity)
      throw new BadRequestException('Not enough stock');
    offer.stock -= quantity;
    await this.writeData(data);
  }

  private async readData(): Promise<Data> {
    const readStream = createReadStream(this.filePath, { encoding: 'utf8' });
    let data = '';

    return new Promise<Data>((resolve, reject) => {
      readStream.on('data', (chunk) => {
        data += chunk;
      });

      readStream.on('end', () => {
        resolve(JSON.parse(data));
      });

      readStream.on('error', (error) => {
        reject(error);
      });
    });
  }

  private async writeData(data: Data): Promise<void> {
    const writeStream = createWriteStream(this.filePath, {
      encoding: 'utf8',
    });

    return new Promise<void>((resolve, reject) => {
      writeStream.write(JSON.stringify(data, null, 2));
      writeStream.end();

      writeStream.on('finish', () => {
        resolve();
      });

      writeStream.on('error', (error) => {
        reject(error);
      });
    });
  }

  private findDataFile(filename: string): string {
    const basePath = resolve('./');
    const filePath = join(basePath, filename);

    if (!existsSync(filePath)) {
      throw new Error(`Data file '${filename}' not found`);
    }

    return filePath;
  }
}
