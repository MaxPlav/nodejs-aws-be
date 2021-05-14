import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';

import { ProductsService } from '../../services';
import { REGION } from '../../config';

export const catalogBatchProcess: any = async (
  event: SQSEvent
) => {
  try {
  console.log('Lambda invokation "catalogBatchProcess" products: ', event.Records);

  const snsQueue = new AWS.SNS({
    region: REGION
  });

  const productService = new ProductsService(snsQueue);
  const products = event.Records.map(({ body }) => JSON.parse(body));

  // create products
  const newProducts = await productService.createProductBatch(products);
  console.log('New products created in db..', newProducts.length);
  
  // notify SNS
  await productService.notifyBatch(products);
  console.log('Finished notification..');

  return {
    statusCode: 200
  };
  } catch(e) {
    console.error('Lambda invokation "catalogBatchProcess": ', e.message);
    return {
      statusCode: 500
    };
  }
};

export const main = middyfy(catalogBatchProcess);
