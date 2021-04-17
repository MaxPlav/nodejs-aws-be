import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { createProduct } from '../../../functions/createProduct/handler';
import { ProductsService } from '../../../services/products';
import { ProductError } from '../../../libs/errors';

jest.mock('../../../services/products');

const mockedData = {
  description: 'description1',
  title: 'product1',
};

describe('createProduct', function () {
  afterEach(() => {
    (ProductsService as any).mockClear();
  });

  it('should return status 201 if correct data provided', async () => {
    const event: APIGatewayEvent = {} as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    (ProductsService as any).mockImplementation(() => {
      return {
        createProduct: () => {
          return mockedData;
        },
      };
    });

    const result: any = await createProduct(event, context, callback);

    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(JSON.stringify(mockedData));
  });

  it('should catch and handle exception if ProductsService throws a general error', async () => {
    const event: APIGatewayEvent = {} as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    const error = new Error('Some error');

    (ProductsService as any).mockImplementation(() => {
      return {
        createProduct: () => {
          throw error;
        },
      };
    });

    const result: any = await createProduct(event, context, callback);

    expect(result.statusCode).toEqual(500);
    expect(result.body).toBe('Internal server error');
  });

  it('should catch and handle exception if ProductsService throws a ProductError error', async () => {
    const event: APIGatewayEvent = {} as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    const error = new ProductError('Some error');

    (ProductsService as any).mockImplementation(() => {
      return {
        createProduct: () => {
          throw error;
        },
      };
    });

    const result: any = await createProduct(event, context, callback);

    expect(result.statusCode).toEqual(400);
    expect(result.body).toBe('Some error');
  });
});
