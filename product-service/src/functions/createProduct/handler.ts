import 'source-map-support/register';
import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda';

import {
  formatJSONResponse,
  formatJSONErrorResponse,
} from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';

import { ProductsService } from '../../services';
import { ProductError } from '../../libs/errors';

export const createProduct: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
) => {
  try {
    console.log('Lambda invokation "createProduct": ', event);

    const productService = new ProductsService();
    const product = await productService.createProduct(event.body);

    return formatJSONResponse(product, 201);
  } catch (e) {
    console.error('Lambda invokation "createProduct": ', e.message);

    if (e instanceof ProductError) {
      return formatJSONErrorResponse(e.message, 400);
    }
    return formatJSONErrorResponse('Internal server error');
  }
};

export const main = middyfy(createProduct);
