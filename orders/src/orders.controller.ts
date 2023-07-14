import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MethodNotAllowedException,
  Param,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateSaleQueueDto } from './dtos/createSaleQueue.dto';
import { isValidDate } from './shared/utils/isValidDate.utils';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly configService: ConfigService,
  ) {}

  @EventPattern('sale_created')
  async handleSaleCreated(@Payload() data: CreateSaleQueueDto) {
    await this.ordersService.createSale(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'get all orders' })
  @ApiResponse({ status: 404, description: 'orders not found' })
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Get('report')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'generate daily report and send to email',
  })
  async generateDailyReport() {
    return await this.ordersService.generateDailyReport();
  }

  @Get('report/:date')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'generate report by date and send to email',
  })
  @ApiResponse({ status: 400, description: 'Invalid date' })
  @ApiResponse({ status: 404, description: 'orders not found for this date' })
  @ApiParam({ name: 'date', example: '2021-09-01' })
  async generateReportByDate(@Param('date') date: string) {
    if (!isValidDate(date)) throw new BadRequestException('Invalid date');
    return await this.ordersService.generateReportByDate(date);
  }

  @Get('report/:date/file')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'get file url for download of report by date',
  })
  @ApiResponse({ status: 400, description: 'Invalid date' })
  @ApiResponse({ status: 404, description: 'orders not found for this date' })
  @ApiResponse({
    status: 405,
    description:
      'Method not allowed for local storage, use generateReportByDate instead or change STORAGE_TYPE to s3',
  })
  @ApiParam({ name: 'date', example: '2021-09-01' })
  async getFileOfReportDateByDate(@Param('date') date: string) {
    if (!isValidDate(date)) throw new BadRequestException('Invalid date');

    if (this.configService.get<string>('STORAGE_TYPE') === 'local') {
      throw new MethodNotAllowedException(
        'Method not allowed for local storage, use generateReportByDate instead or change STORAGE_TYPE to s3',
      );
    }
    return {
      url: await this.ordersService.getFileOfReportDateByDate(date),
    };
  }
}
