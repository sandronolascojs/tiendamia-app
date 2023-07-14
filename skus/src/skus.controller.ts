import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SkusService } from './skus.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Sku } from './entities/sku.entity';
import { PaginationDto } from './dtos/pagination.dto';

@ApiTags('skus')
@Controller('skus')
export class SkusController {
  constructor(private readonly skusService: SkusService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Get all skus' })
  async getAllSkus(@Query() paginationDto: PaginationDto): Promise<{
    data: Sku[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    const { page = 1, limit = 1 } = paginationDto;
    const offset = (page - 1) * limit;

    const skus = await this.skusService.findAll();

    const paginatedSkus = skus.slice(offset, offset + limit);
    const totalSkus = skus.length;

    const currentPage = page;
    const totalPages = Math.ceil(totalSkus / limit);

    return {
      data: paginatedSkus,
      currentPage,
      totalPages,
      totalItems: totalSkus,
    };
  }

  @Get(':sku')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Get sku by id' })
  @ApiResponse({ status: 404, description: 'Sku not found' })
  async getSkuById(@Param('sku') sku: string) {
    const skuFound = await this.skusService.findById(sku);
    return skuFound;
  }

  @Get('getAllSkuOffers/:sku')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'get sku offers by id' })
  @ApiResponse({ status: 404, description: 'No offers found' })
  async getOffersBySKU(@Param('sku') sku: string) {
    const offers = await this.skusService.findOffersBySkuId(sku);
    return offers;
  }

  @Get('getBestSkuOffer/:sku')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'get best offer by sku id' })
  async getBestOfferBySKU(@Param('sku') sku: string) {
    const offer = await this.skusService.findBestOfferBySkuId(sku);
    return offer;
  }

  @Get('getBestSkuOffers/:sku')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'get best offers with limit by sku id',
  })
  @ApiResponse({ status: 400, description: 'limit must be a number' })
  @ApiResponse({ status: 404, description: 'Sku not found' })
  @ApiResponse({ status: 404, description: 'No offers found' })
  async getBestOffersBySKU(
    @Param('sku') sku: string,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const offers = await this.skusService.findBestOffersBySkuId(sku, limit);
    return offers;
  }
}
