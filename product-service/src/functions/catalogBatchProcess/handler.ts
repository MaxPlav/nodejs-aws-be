import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { SQSEvent, SQSHandler } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';

import { ProductsService } from '../../services';
import { AWS_REGION } from '../../constants';

export const catalogBatchProcess: SQSHandler = async (
  event: SQSEvent
) => {
  try {
  console.log('Lambda invokation "catalogBatchProcess": ', event);

  const snsQueue = new AWS.SNS({
    region: AWS_REGION
  });
  const productService = new ProductsService(snsQueue);
  const products = event.Records.map(({ body }) => body);
  
  // notify SNS
  await productService.notify(products);

  // create products
  const newProducts = await productService.createProductBatch(products);
  console.log('Products are created ', newProducts);
  } catch(e) {
    console.error('Lambda invokation "catalogBatchProcess": ', e.message);
  }
};

export const main = middyfy(catalogBatchProcess);
