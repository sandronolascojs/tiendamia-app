import { IConnection } from 'src/shared/interfaces/IConnection';
import { IRepository } from 'src/shared/interfaces/IRepository';

export abstract class AbstractRepository<Entity>
  implements IRepository<Entity>
{
  constructor(private readonly connection: IConnection<Entity>) {}
  async create(entity: Entity): Promise<void> {
    return await this.connection.create(entity);
  }
  async update(id: number, entity: Entity): Promise<Entity> {
    return await this.connection.update(id, entity);
  }
  async delete(id: number): Promise<void> {
    return await this.connection.delete(id);
  }
  async findAll(): Promise<Entity[]> {
    return await this.connection.findAll();
  }
  async findById(id: number): Promise<Entity> {
    return await this.connection.findById(id);
  }
  async exists(id: number): Promise<boolean> {
    return await this.connection.exists(id);
  }
}
