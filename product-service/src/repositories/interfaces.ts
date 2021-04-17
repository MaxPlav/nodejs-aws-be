export interface IWrite<T> {
  create(item: T): Promise<string | T>;
  update(id: string, item: T): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export interface IRead<T> {
  findAll(item: T): Promise<T[]>;
  findOne(id: string): Promise<string | T>;
}
