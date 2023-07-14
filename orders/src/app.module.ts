import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders.module';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [ConfigModule],
})
export class AppModule {}
