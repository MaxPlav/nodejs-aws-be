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
import productList from '../../libs/productList.js';

export const getProductsList: APIGatewayProxyHandler = async (
  _: APIGatewayEvent,
  __: Context,
  callback: Callback
) => {
  try {
    return formatJSONResponse(productList);
  } catch (e) {
    console.error('Lambda invokation "getProductsList": ', e);
    callback(null, formatJSONErrorResponse(500, 'Internal server error'));
  }
};

export const main = middyfy(getProductsList);
