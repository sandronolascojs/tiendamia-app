import { Sku } from 'src/entities/sku.entity';
import { AbstractRepository } from '../shared/classes/AbstractRepository';
import { InMemorySkusConnection } from './InMemorySkusConnection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemorySkusRepository extends AbstractRepository<Sku> {
  constructor(connection: InMemorySkusConnection) {
    super(connection);
  }
}
