import { typeId } from './typeId';

export interface IRepository<T> {
  create(entity: T): Promise<void>;
  update(id: typeId<number, string>, entity: T): Promise<T>;
  delete(id: typeId<number, string>): Promise<void>;
  findAll(): Promise<T[]>;
  findById(id: typeId<number, string>): Promise<T>;
  exists(id: typeId<number, string>): Promise<boolean>;
}
