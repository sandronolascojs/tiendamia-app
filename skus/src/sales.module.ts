import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { InFileSkusRepository } from './repositories/InFileSkusRepository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InFileSkusConnection } from './repositories/InFileSkusConnection';
import { SalesService } from './sales.service';
import { repositories } from './shared/constants/repositories.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SALES_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('RABBITMQ_URL')}`],
            queue: configService.get('RABBITMQ_QUEUE'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [SalesController],
  providers: [
    {
      provide: repositories.SkusRepository,
      useClass: InFileSkusRepository,
    },
    {
      provide: 'DATA_PATH',
      useValue: 'data.json',
    },
    InFileSkusConnection,
    SalesService,
  ],
  exports: [ClientsModule],
})
export class SalesModule {}
