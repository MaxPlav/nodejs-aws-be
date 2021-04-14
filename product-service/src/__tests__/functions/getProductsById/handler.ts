import { APIGatewayEvent, Context, Callback } from 'aws-lambda'

import { getProductsById } from '../../../functions/getProductsById/handler';

jest.mock('../../../libs/productList.js', function() {
  return [
    {
      "id": "1",
      "title": "product1",
    },
    {
      "id": "2",
      "title": "product2",
    },
  ];
});

describe('getProductsById', function() {
  it('should return status 200 and products by id', async() => {
    const event: APIGatewayEvent = {
      pathParameters: {
        id: '2'
      }
    } as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    const result: any = await getProductsById(event, context, callback);
    const product = JSON.parse(result.body);

    expect(result.statusCode).toEqual(200);
    expect(product.id).toEqual('2');
    expect(product.title).toEqual('product2');
  });

  it('should return status 404 if product is not found', (done) => {
    const error = {
      statusCode: 404,
      body: 'Product not found',
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };

    const event: APIGatewayEvent = {
      pathParameters: {
        id: '3'
      }
    } as any;
    const context: Context = {} as any;
    const callback: Callback = jest.fn((a, result) => {
      expect(a).toBeNull();
      expect(result).toEqual(error);
      done()
    });

    getProductsById(event, context, callback);
  });

  it('should return status 500 if product "id" is not specified', (done) => {
    const error = {
      statusCode: 500,
      body: 'Internal server error',
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
    
    const event: APIGatewayEvent = {} as any;
    const context: Context = {} as any;
    const callback: Callback = jest.fn((a, result) => {
      expect(a).toBeNull();
      expect(result).toEqual(error);
      done();
    });

    getProductsById(event, context, callback);
  });
});