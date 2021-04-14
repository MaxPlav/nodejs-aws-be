import 'source-map-support/register';
import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  Callback,
} from 'aws-lambda';

import {
  formatJSONResponse,
  formatJSONErrorResponse,
} from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';
import { findItemById } from '../../libs/utils';
import productList from '../../libs/productList.js';

export const getProductsById: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _: Context,
  callback: Callback
) => {
  try {
    const id = event.pathParameters.id;

    if (!id) {
      callback(null, formatJSONErrorResponse(404, 'Product not found'));
    }

    const product = findItemById(productList, id);
    if (!product) {
      callback(null, formatJSONErrorResponse(404, 'Product not found'));
    }

    return formatJSONResponse(product);
  } catch (e) {
    console.error('Lambda invokation "getProductsById": ', e);
    callback(null, formatJSONErrorResponse(500, 'Internal server error'));
  }
};

export const main = middyfy(getProductsById);
