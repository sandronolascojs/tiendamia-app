import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  @ApiProperty()
  skuId: string;

  @IsNumber()
  @ApiProperty()
  offerId: number;

  @IsNumber()
  @ApiProperty()
  quantity: number;
}
