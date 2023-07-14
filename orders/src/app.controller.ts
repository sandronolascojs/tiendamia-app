import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'app health' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  healthCheck(): string {
    return 'ok';
  }
}
