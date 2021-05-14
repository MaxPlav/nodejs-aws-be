import { IWrite, IRead } from './interfaces';
import { Client, PoolClient } from 'pg';

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  public readonly connection: Client | PoolClient;

  constructor(connection: Client | PoolClient) {
    this.connection = connection;
  }
  create(_item: T): Promise<string | T> {
    throw new Error('Method not implemented.');
  }
  update(_id: string, _item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  delete(_id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  findOne(_id: string): Promise<string | T> {
    throw new Error('Method not implemented.');
  }
}
