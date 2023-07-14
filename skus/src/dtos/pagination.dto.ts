import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @Min(1)
  @ApiProperty()
  page: number;

  @IsInt()
  @Min(1)
  @ApiProperty()
  limit: number;
}
