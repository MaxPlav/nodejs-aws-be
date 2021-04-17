import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { getProductsById } from '../../../functions/getProductsById/handler';
import { ProductsService } from '../../../services/products';

jest.mock('../../../services/products');

const mockedData = [
  {
    id: '1',
    title: 'product1',
  },
  {
    id: '2',
    title: 'product2',
  },
];

describe('getProductsById', function () {
  beforeAll(() => {
    (ProductsService as any).mockImplementation(() => {
      return {
        getProductById: (id) => {
          return mockedData.find((o) => o.id === id);
        },
      };
    });
  });

  afterEach(() => {
    (ProductsService as any).mockClear();
  });

  it('should return status 200 and products by id', async () => {
    const event: APIGatewayEvent = {
      pathParameters: {
        id: '2',
      },
    } as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    const result: any = await getProductsById(event, context, callback);
    const product = JSON.parse(result.body);

    expect(result.statusCode).toEqual(200);
    expect(product.id).toEqual('2');
    expect(product.title).toEqual('product2');
  });

  it('should return status 404 if product is not found', async () => {
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
        id: '3',
      },
    } as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    const result: any = await getProductsById(event, context, callback);

    expect(result).toEqual(error);
  });

  it('should return status 500 if product "id" is not specified', async () => {
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
    const callback: Callback = {} as any;

    const result: any = await getProductsById(event, context, callback);

    expect(result).toEqual(error);
  });
});
