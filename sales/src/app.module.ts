import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SalesModule } from './modules/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SalesModule,
  ],
  controllers: [],
  providers: [ConfigModule],
})
export class AppModule {}
