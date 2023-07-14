import { Module } from '@nestjs/common';
import { SkusService } from './skus.service';
import { SkusController } from './skus.controller';
import { repositories } from './shared/constants/repositories.constants';
import { InMemorySkusConnection } from './repositories/InMemorySkusConnection';
import { InFileSkusRepository } from './repositories/InFileSkusRepository';
import { InFileSkusConnection } from './repositories/InFileSkusConnection';

@Module({
  imports: [],
  controllers: [SkusController],
  providers: [
    SkusService,
    {
      provide: 'DATA_PATH',
      useValue: 'data.json',
    },
    {
      provide: repositories.SkusRepository,
      useClass: InFileSkusRepository,
    },
    InMemorySkusConnection,
    InFileSkusConnection,
  ],
  exports: [],
})
export class SkusModule {}
