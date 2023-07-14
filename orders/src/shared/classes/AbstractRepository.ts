import { IConnection } from '../interfaces/IConnection';
import { IRepository } from '../interfaces/IRepository';
import { typeId } from '../interfaces/typeId';

export abstract class AbstractRepository<Entity>
  implements IRepository<Entity>
{
  constructor(protected readonly connection: IConnection<Entity>) {}
  async create(entity: Entity): Promise<void> {
    return await this.connection.create(entity);
  }
  async update(id: typeId, entity: Entity): Promise<Entity> {
    return await this.connection.update(id, entity);
  }
  async delete(id: typeId): Promise<void> {
    return await this.connection.delete(id);
  }
  async findAll(): Promise<Entity[]> {
    return await this.connection.findAll();
  }
  async findById(id: typeId): Promise<Entity> {
    return await this.connection.findById(id);
  }
  async exists(id: typeId): Promise<boolean> {
    return await this.connection.exists(id);
  }
}
