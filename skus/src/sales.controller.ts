import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dtos/createSale.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Sale created' })
  @ApiResponse({ status: 400, description: 'Not enough stock for this offer' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  async createSale(@Body() createSaleDto: CreateSaleDto): Promise<void> {
    return await this.salesService.createSale(createSaleDto);
  }
}
