import { unlinkSync } from 'node:fs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import * as ExcelJS from 'exceljs';

import { Sale } from './entities/sale.entity';
import { ISalesRepository } from './interfaces/ISkuRepository';
import { CreateSaleQueueDto } from './dtos/createSaleQueue.dto';
import {
  repositories,
  services,
} from './shared/constants/repositories.constants';
import { EmailNotificationService } from './emailNotification.service';
import { IStorageService } from './interfaces/IStorageService';
import { Attachment } from 'nodemailer/lib/mailer';
import { randomUUID } from 'node:crypto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(repositories.SalesRepository)
    private readonly salesRepository: ISalesRepository<Sale>,
    @Inject(services.StorageService)
    private readonly storageService: IStorageService,
    private readonly emailNotificationService: EmailNotificationService,
    private readonly configService: ConfigService,
  ) {}
  async createSale({
    sku,
    offerId,
    price,
    quantity,
    shippingPrice,
    total,
    seller,
    sale_date,
  }: CreateSaleQueueDto) {
    const sale = Sale.create({
      sku,
      offerId,
      price,
      quantity,
      shippingPrice,
      total,
      seller,
      sale_date,
    });
    await this.salesRepository.create(sale);
  }

  async findAll(): Promise<Sale[]> {
    return await this.salesRepository.findAll();
  }

  @Cron('59 23 * * *') // Ejecutar el cron job todos los días a las 23:59
  async generateDailyReport() {
    const fileUUID = randomUUID();
    const todayDateFormatted = new Date().toISOString().split('T')[0];
    const sales = await this.salesRepository.generateDailyReport();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');
    worksheet.addRow([
      'SKU',
      'Cantidad',
      'Precio',
      'Precio de envío',
      'Total',
      'Vendedor',
      'Fecha de venta',
    ]);
    sales.forEach((sale) => {
      worksheet.addRow([
        sale.sku,
        sale.quantity,
        sale.price,
        sale.shippingPrice,
        sale.total,
        sale.seller,
        sale.sale_date,
      ]);
    });

    const tempFilePath = `daily_report_${todayDateFormatted}-${fileUUID}.xlsx`;
    await workbook.xlsx.writeFile(tempFilePath);

    const s3Key = `daily_reports/${tempFilePath}`;
    await this.storageService.uploadFile(tempFilePath, s3Key);

    const from = this.configService.get<string>('EMAIL_SENDER');
    const to = this.configService.get<string>('EMAIL_ADMIN_RECEIVER');
    const subject = 'Informe diario de ventas';
    const text = 'Adjunto encontrarás el informe diario de ventas.';

    if (this.configService.get<string>('STORAGE_TYPE') === 'local') {
      const attachment: Attachment = {
        filename: `daily_report_${todayDateFormatted}-${fileUUID}.xlsx`,
        path: `./${tempFilePath}`,
      };
      await this.emailNotificationService.sendEmailWithAttachment(
        from,
        to,
        subject,
        text,
        attachment,
      );

      return unlinkSync(tempFilePath);
    }

    const attachment: Attachment = {
      filename: `daily_report_${todayDateFormatted}-${fileUUID}.xlsx`,
      path: `https://${this.configService.get<string>(
        'S3_BUCKET',
      )}.s3.amazonaws.com/${s3Key}`,
    };

    await this.emailNotificationService.sendEmailWithAttachment(
      from,
      to,
      subject,
      text,
      attachment,
    );

    unlinkSync(tempFilePath);
  }

  async generateReportByDate(date: string) {
    const fileUUID = randomUUID();
    const todayDateFormatted = new Date().toISOString().split('T')[0];
    const sales = await this.salesRepository.generateReportByDate(date);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');
    worksheet.addRow([
      'SKU',
      'Cantidad',
      'Precio',
      'Precio de envío',
      'Total',
      'Vendedor',
      'Fecha de venta',
    ]);
    sales.forEach((sale) => {
      worksheet.addRow([
        sale.sku,
        sale.quantity,
        sale.price,
        sale.shippingPrice,
        sale.total,
        sale.seller,
        sale.sale_date,
      ]);
    });

    const tempFilePath = `daily_report_${todayDateFormatted}-${fileUUID}.xlsx`;
    await workbook.xlsx.writeFile(tempFilePath);

    const s3Key = `daily_reports/${tempFilePath}`;
    await this.storageService.uploadFile(tempFilePath, s3Key);

    const from = this.configService.get<string>('EMAIL_SENDER');
    const to = this.configService.get<string>('EMAIL_ADMIN_RECEIVER');
    const subject = 'Informe diario de ventas';
    const text = 'Adjunto encontrarás el informe diario de ventas.';

    if (this.configService.get<string>('STORAGE_TYPE') === 'local') {
      const attachment: Attachment = {
        filename: `daily_report_${todayDateFormatted}-${fileUUID}.xlsx`,
        path: `./${tempFilePath}`,
      };
      await this.emailNotificationService.sendEmailWithAttachment(
        from,
        to,
        subject,
        text,
        attachment,
      );

      return unlinkSync(tempFilePath);
    }

    const attachment: Attachment = {
      filename: `daily_report_${todayDateFormatted}-${fileUUID}.xlsx`,
      path: `https://${this.configService.get<string>(
        'S3_BUCKET',
      )}.s3.amazonaws.com/${s3Key}`,
    };

    await this.emailNotificationService.sendEmailWithAttachment(
      from,
      to,
      subject,
      text,
      attachment,
    );

    unlinkSync(tempFilePath);
  }

  async getFileOfReportDateByDate(date: string): Promise<string> {
    const objects = await this.storageService.listAllFiles('daily_reports');

    const file = this.getFileNameByDate(objects, date);

    if (!file) throw new NotFoundException('file not found for this date');

    if (this.configService.get<string>('STORAGE_TYPE') === 'local') {
      const fileUrl = await this.storageService.getFileUrl(
        file,
        'daily_reports',
      );
      return fileUrl;
    }
    const fileUrl = await this.storageService.getFileUrl(file);
    return fileUrl;
  }

  private getFileNameByDate(
    fileNames: string[],
    date: string,
  ): string | undefined {
    const fileNamePrefix = `daily_report_${date}-`;
    const matchingFileName = fileNames.find((fileName) =>
      fileName.includes(fileNamePrefix),
    );

    return matchingFileName;
  }
}
