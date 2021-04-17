import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { getProductsList } from '../../../functions/getProductsList/handler';
import { ProductsService } from '../../../services/products';

jest.mock('../../../services/products');

const mockedData = [
  {
    title: 'product1',
  },
  {
    title: 'product2',
  },
];

describe('getProductsList', function () {
  beforeAll(() => {
    (ProductsService as any).mockImplementation(() => {
      return {
        getProductsList: () => {
          return mockedData;
        },
      };
    });
  });

  afterEach(() => {
    (ProductsService as any).mockClear();
  });

  it('should return status 200 and all products in body', async () => {
    const event: APIGatewayEvent = {} as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    const result: any = await getProductsList(event, context, callback);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify(mockedData));
  });
});
