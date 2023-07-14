import { describe } from 'vitest';
import { InFileSkusConnection } from '../../src/repositories/InFileSkusConnection';

describe('InFileSkusConnection', () => {
  it('should be defined', () => {
    expect(InFileSkusConnection).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof InFileSkusConnection).toBe('function');
  });

  it('should have a method called findBestOfferBySkuId', () => {
    expect(InFileSkusConnection.prototype.findBestOfferBySkuId).toBeDefined();
  });

  it('should return an offer when findBestOfferBySkuId is called', async () => {
    const connection = new InFileSkusConnection(
      'test/repositories/InFileSkusConnection.test.json',
    );
    const offer = await connection.findBestOfferBySkuId('SKU001');
    expect(offer).toEqual({
      id: 2,
      price: 1690,
      stock: 2,
      shipping_price: 25,
      delivery_date: '2024-02-17',
      can_be_refunded: false,
      status: 'new',
      guarantee: false,
      seller: {
        name: 'Marks Group',
        qualification: 4,
        reviews_quantity: 35,
      },
    });
  });

  it('should throw an error when findBestOfferBySkuId is called with an invalid sku', async () => {
    const connection = new InFileSkusConnection(
      'test/repositories/InFileSkusConnection.test.json',
    );
    await expect(connection.findBestOfferBySkuId('SKU999')).rejects.toThrow(
      'Sku not found',
    );
  });

  it('should throw an error when findBestOfferBySkuId is called with a sku with no offers', async () => {
    const connection = new InFileSkusConnection(
      'test/repositories/InFileSkusConnection.test.json',
    );
    await expect(connection.findBestOfferBySkuId('SKU002')).rejects.toThrow(
      'No offers found',
    );
  });
});
