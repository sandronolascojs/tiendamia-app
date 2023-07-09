import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [ReportsController],
  controllers: [],
  providers: [ReportsService],
  exports: [],
})
export class ReportsModule {}
