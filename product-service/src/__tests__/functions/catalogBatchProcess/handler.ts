import { SQSEvent, Context, Callback } from 'aws-lambda';
import { catalogBatchProcess } from '../../../functions/catalogBatchProcess/handler';
import { ProductsService } from '../../../services/products';

jest.mock('../../../services/products');

describe('catalogBatchProcess', function () { 
  afterEach(() => {
    (ProductsService as any).mockClear();
  });

  it('should return status 200 if correct data is provided', async () => {
    const eventRecordsMock = [
      {
        title: 'Product1'
      },
      {
        title: 'Product2'
      }
    ];

    const event: SQSEvent = {
      Records: [
        {
          body: JSON.stringify(eventRecordsMock[0])
        },
        {
          body: JSON.stringify(eventRecordsMock[1])
        }
      ]
    } as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    (ProductsService as any).mockImplementation(() => {
      return {
        createProductBatch: () => {
          return eventRecordsMock;
        },
        notifyBatch: () => {
          return Promise.resolve([]);
        }
      };
    });

    const result: any = await catalogBatchProcess(event, context, callback);

    expect(result.statusCode).toEqual(200);
  });

  it('should catch and handle exception if ProductsService throws an error', async () => {
    const event: SQSEvent = {} as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    const error = new Error('Some error');

    (ProductsService as any).mockImplementation(() => {
      return {
        createProductBatch: () => {
          throw error;
        },
        notifyBatch: () => {
          return Promise.resolve([]);
        }
      };
    });

    const result: any = await catalogBatchProcess(event, context, callback);

    expect(result.statusCode).toEqual(500);
  });
});