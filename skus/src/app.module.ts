import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SkusModule } from './skus.module';
import { SalesModule } from './sales.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SkusModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [ConfigModule],
})
export class AppModule {}
