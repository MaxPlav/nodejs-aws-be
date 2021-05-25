import * as AWS from 'aws-sdk';
import { isString, isEmpty, isInteger, gt } from 'lodash';
import { ClientConfig, Client } from 'pg';

import { Product } from '../entities/product';
import { ProductError } from '../libs/errors';

import { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD, SNS_ARN } from '../config';

const dbOptions: ClientConfig = {
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

export class ProductsService {
  constructor(private _snsQueue?: AWS.SNS) {}

  public async getProductsList(): Promise<Product[]> {
    const client = new Client(dbOptions);
    await client.connect();

    const productRepository = new ProductRepository(client);
    return productRepository.findAll().finally(() => {
      client.end();
    });
  }

  public async getProductById(id: string): Promise<Product> {
    if (!isValidUUID(id)) {
      return Promise.reject(new ProductError('Product ID is invalid'));
    }

    const client = new Client(dbOptions);
    await client.connect();

    const productRepository = new ProductRepository(client);
    return productRepository.findOne(id).finally(() => {
      client.end();
    });
  }

  public async createProduct(data: any): Promise<Product> {
    if (!isValidProduct(data)) {
      return Promise.reject(new ProductError('Product data is invalid'));
    }
    const client = new Client(dbOptions);
    await client.connect();

    const entity = new Product(data);    
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
    await client.connect();

    const productRepository = new ProductRepository(client);

    const newProducts = [];
    try {
      for (const item of products) {
        const entity = new Product(item);
        newProducts.push(await productRepository.create(entity));
      }
      return newProducts;
    } finally {
      client.end();
    }
  }

  public notifyBatch(products: any[]): Promise<any[]> {
    if (!products || !products.length) {
      return Promise.reject(new ProductError('No data provided for notification'));
    }
    const promises = [];
    for (const product of products) {
      promises.push(this._sendEmail(product));
    }

    return Promise.all(promises);
  }

  private async _sendEmail(product): Promise<void> {
    return new Promise((resolve, reject) => {
      this._snsQueue.publish({
        Subject: 'New product is imported',
        Message: JSON.stringify(product),
        MessageAttributes: {
          count: {
            DataType: 'Number',
            StringValue: product.count
          }
        },
        TopicArn: SNS_ARN
      }, (error) => {
        if (error) {
          reject(error);
          console.error('Sending product to email error: ', error.message);
        } else {
          console.log('Sent email with new product: ', product);
          resolve();
        }
      });
    });

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
