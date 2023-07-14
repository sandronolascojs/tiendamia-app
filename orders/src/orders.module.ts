import { Module } from '@nestjs/common';
import {
  repositories,
  services,
} from './shared/constants/repositories.constants';
import { PostgresSalesRepository } from './repositories/PostgresSalesRepository';
import { PostgresConnection } from './repositories/PostgresConnection';
import { PrismaService } from './shared/prisma.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { S3StorageService } from './s3.storage.service';
import { EmailNotificationService } from './emailNotification.service';
import { ConfigService } from '@nestjs/config';
import { LocalStorageService } from './local.storage.service';

const storageServiceFactory = (configService: ConfigService) => {
  if (configService.get('STORAGE_TYPE') === 'local') {
    return new LocalStorageService(
      configService.get('LOCAL_STORAGE_PATH'),
      configService.get('LOCAL_STORAGE_HOST'),
    );
  }

  if (configService.get('STORAGE_TYPE') === 's3') {
    return new S3StorageService(
      configService.get('AWS_ID_ACCESS_KEY'),
      configService.get('AWS_SECRET_ACCESS_KEY'),
      configService.get('AWS_REGION'),
      configService.get('S3_BUCKET'),
    );
  }
};

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: repositories.SalesRepository,
      useClass: PostgresSalesRepository,
    },
    PostgresConnection,
    PrismaService,
    {
      provide: EmailNotificationService,
      useFactory: (configService: ConfigService) => {
        return new EmailNotificationService(
          configService.get('EMAIL_HOST'),
          configService.get('EMAIL_PORT'),
          configService.get('EMAIL_USER'),
          configService.get('EMAIL_PASSWORD'),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: services.StorageService,
      useFactory: storageServiceFactory,
      inject: [ConfigService],
    },
    ConfigService,
  ],
  exports: [],
})
export class OrdersModule {}
