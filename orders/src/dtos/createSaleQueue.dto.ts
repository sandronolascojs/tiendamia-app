import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSaleQueueDto {
  @IsString()
  @ApiProperty()
  sku: string;

  @IsNumber()
  @ApiProperty()
  offerId: number;

  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNumber()
  @ApiProperty()
  total: number;

  @IsNumber()
  @ApiProperty()
  shippingPrice: number;

  @IsString()
  @ApiProperty()
  seller: string;

  @IsString()
  @ApiProperty()
  sale_date: string;
}
