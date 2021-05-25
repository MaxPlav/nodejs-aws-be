import 'source-map-support/register';
import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda';

import {
  formatJSONResponse,
  formatJSONErrorResponse,
} from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';

import { ProductsService } from '../../services';

export const getProductsList: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
) => {
  try {
    console.log('Lambda invokation "getProductsList": ', event);

    const productService = new ProductsService();
    const products = await productService.getProductsList();

    return formatJSONResponse(products);
  } catch (e) {
    console.error('Lambda invokation "getProductsList": ', e);
    return formatJSONErrorResponse('Internal server error');
  }
};

export const main = middyfy(getProductsList);
