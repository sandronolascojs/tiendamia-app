import { IRepository } from 'src/shared/interfaces/IRepository';

export interface ISalesRepository<Sale> extends IRepository<Sale> {
  findSalesBySkuId(skuId: string): Promise<Sale[]>;
  generateDailyReport(): Promise<Sale[]>;
  generateReportByDate(date: string): Promise<Sale[]>;
}
