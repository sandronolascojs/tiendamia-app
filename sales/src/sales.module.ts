import { Module } from '@nestjs/common';
import {  SalesService } from './sales.service';
import { SalesController } from './sales.controller';

@Module({
  imports: [SalesController],
  controllers: [],
  providers: [SalesService],
  exports: [],
})
export class SalesModule {}
