import 'source-map-support/register';
import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda';

import {
  formatJSONResponse,
  formatJSONErrorResponse,
} from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';

import { ProductsService } from '../../services';
import { ProductError } from '../../libs/errors';

export const getProductsById: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
) => {
  try {
    console.log('Lambda invokation "getProductsById": ', event);

    const id = event.pathParameters.id;
    if (!id) {
      return formatJSONErrorResponse('Bad input parameter', 400);
    }

    const productService = new ProductsService();
    const product = await productService.getProductById(id);

    if (!product) {
      return formatJSONErrorResponse('Product not found', 404);
    }

    return formatJSONResponse(product);
  } catch (e) {
    console.error('Lambda invokation "getProductsById": ', e.message);
    
    if (e instanceof ProductError) {
      return formatJSONErrorResponse(e.message, 400);
    }
    return formatJSONErrorResponse('Internal server error');
  }
};

export const main = middyfy(getProductsById);
