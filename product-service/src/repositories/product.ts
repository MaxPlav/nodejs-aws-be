import { BaseRepository } from './base';
import { Product } from '../entities/product';

export class ProductRepository extends BaseRepository<Product> {
  async create(entity: Product): Promise<Product> {
    let newProductId: string;
    let newStockId: string;

    try {
      await this.connection.connect();

      const dbResultProducts = await this.connection.query(`
      insert into products(title, description, image, price) values
        ('${entity.getTitle()}', '${entity.getDescription()}', '${entity.getImage()}', ${entity.getPrice()})
        returning id;
    `);

      newProductId = dbResultProducts.rows[0].id;

      // Create a new stock entry
      const dbResultStocks = await this.connection.query(`
        insert into stocks(product_id, count) values
          ('${newProductId}', ${entity.getCount()})
          returning id;
      `);

      newStockId = dbResultStocks.rows[0].id;

      // Fetch newly created aggregated product
      const products = await this.connection.query(`
        select p.id, p.title, p.description, p.price, p.image, s.count
          from products p
          inner join stocks s on p.id = s.product_id
        where p.id='${newProductId}'
      `);

      return products.rows[0];
    } catch (e) {
      // Return an error,
      console.error('ProductRepository at create(): ', e.message);

      try {
        if (newProductId) {
          // rollback changes
          await this.connection.query(
            `delete from products p where p.id='${newProductId}'`
          );
        }

        if (newStockId) {
          await this.connection.query(
            `delete from stocks s where s.id='${newStockId}'`
          );
        }
      } catch (e) {
        console.error(
          'ProductRepository at create(): rollback error ',
          e.message
        );
      } finally {
        return Promise.reject(new Error('Database error occurred'));
      }
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      await this.connection.connect();

      const dbResult = await this.connection.query(`
        select p.id, p.title, p.description, p.price, p.image, s.count
          from products p
          inner join stocks s on p.id = s.product_id
      `);
      return dbResult.rows;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      await this.connection.connect();

      const dbResult = await this.connection.query(`
        select p.id, p.title, p.description, p.price, p.image, s.count
          from products p
          inner join stocks s on p.id = s.product_id
        where p.id='${id}'
      `);

      return dbResult.rows[0];
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
