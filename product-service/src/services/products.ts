import * as AWS from 'aws-sdk';
import { isString, isEmpty, isInteger, gt } from 'lodash';
import { Client, ConnectionConfig } from 'pg';

import { Product } from '../entities/product';
import { ProductError } from '../libs/errors';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions: ConnectionConfig = {
  host: PG_HOST,
  port: Number(PG_PORT),
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // to avoid warring in this example
  },
  connectionTimeoutMillis: 5000, // time in millisecond for termination of the database query
};

import { isValidUUID } from '../libs/utils';
import { ProductRepository } from '../repositories/product';

const SNS_ARN = process.env.SNS_ARN;
export class ProductsService {
  constructor(private _snsQueue?: AWS.SNS) {}

  public getProductsList(): Promise<Product[]> {
    const client = new Client(dbOptions);

    const productRepository = new ProductRepository(client);
    return productRepository.findAll().finally(() => {
      client.end();
    });
  }

  public getProductById(id: string): Promise<Product> {
    if (!isValidUUID(id)) {
      return Promise.reject(new ProductError('Product ID is invalid'));
    }

    const client = new Client(dbOptions);

    const productRepository = new ProductRepository(client);
    return productRepository.findOne(id).finally(() => {
      client.end();
    });
  }

  public createProduct(data: any): Promise<Product> {
    if (!isValidProduct(data)) {
      return Promise.reject(new ProductError('Product data is invalid'));
    }

    const entity = new Product(data);

    const client = new Client(dbOptions);
    const productRepository = new ProductRepository(client);

    return productRepository.create(entity).finally(() => {
      client.end();
    });
  }

  public async createProductBatch(products: any[]): Promise<Product[]> {
    if (!products || !products.length) {
      return Promise.reject(new ProductError('No data provided at "createProductBatch"'));
    }
    const client = new Client(dbOptions);
    const productRepository = new ProductRepository(client);

    try {
      for (const item of products) {
        const entity = new Product(item);
        await productRepository.create(entity);
      }
    } finally {
      client.end();
    }
  }

  public async notify(products): Promise<void> {
    if (!products || !products.length) {
      return Promise.reject(new ProductError('No data provided at "notify"'));
    }
    return this._snsQueue.publish({
      Subject: 'New products are imported',
      Message: JSON.stringify(products),
      TopicArn: SNS_ARN
    }, () => {
      console.log('Sent emails with new products: ', products);
    })
  }
}

export function isValidProduct(product): boolean {
  if (isEmpty(product)) {
    return false;
  }
  let isValid = true;

  const validationSchema = {
    title: (v) => !isEmpty(v) && isString(v),
    description: (v) => !isEmpty(v) && isString(v),
    image: (v) => !isEmpty(v) && isString(v),
    price: (v) => isInteger(v) && gt(v, 0),
    count: (v) => isInteger(v) && gt(v, 0),
  };

  for (let key in validationSchema) {
    if (!validationSchema[key](product[key])) {
      isValid = false;
      break;
    }
  }

  return isValid;
}
