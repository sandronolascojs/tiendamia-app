export interface IConnection<T> {
  create(entity: T): Promise<void>;
  update(id: number, entity: T): Promise<T>;
  delete(id: number): Promise<void>;
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T>;
  exists(id: number): Promise<boolean>;
}
