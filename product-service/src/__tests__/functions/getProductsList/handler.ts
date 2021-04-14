import { APIGatewayEvent, Context, Callback } from 'aws-lambda'

import { getProductsList } from '../../../functions/getProductsList/handler';

jest.mock('../../../libs/productList.js', function() {
  return [
    {
      "title": "product1",
    },
    {
      "title": "product2",
    },
  ];
});

describe('getProductsList', function() {
  it('should return status 200 and all products in body', async() => {
    const event: APIGatewayEvent = {} as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    const result: any = await getProductsList(event, context, callback);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify([
      {
        "title": "product1",
      },
      {
        "title": "product2",
      },
    ]));
  });
});