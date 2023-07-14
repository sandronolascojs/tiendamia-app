import { typeId } from './typeId';

export interface IRepository<T> {
  create(entity: T): Promise<void>;
  update(id: typeId, entity: T): Promise<T>;
  delete(id: typeId): Promise<void>;
  findAll(): Promise<T[]>;
  findById(id: typeId): Promise<T>;
  exists(id: typeId): Promise<boolean>;
}
