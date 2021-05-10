import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { importProductsFile } from '../../../functions/importProductsFile/handler';
import { ImportService } from '../../../services/import';
import { UPLOAD_FILE_PATH } from '../../../constants';

jest.mock('../../../services/import');

describe('importProductsFile', function () {
  beforeAll(() => {
    (ImportService as any).mockImplementation(() => {
      return {
        getS3ImportSignedUrl: (filePath) => {
          return Promise.resolve('somepath/' + filePath);
        },
      };
    });
  });

  afterEach(() => {
    (ImportService as any).mockClear();
  });

  it('should return status 200 and url to a file', async () => {
    const filename = 'myfile.csv';

    const event: APIGatewayEvent = {
      queryStringParameters: {
        name: filename,
      },
    } as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    const result: any = await importProductsFile(event, context, callback);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(
      JSON.stringify({
        url: `somepath/${UPLOAD_FILE_PATH}/${filename}`,
      })
    );
  });

  it('should return 422 error if filename is not provided in query params', async () => {
    const event: APIGatewayEvent = {
      queryStringParameters: {},
    } as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    const result: any = await importProductsFile(event, context, callback);

    expect(result.statusCode).toEqual(422);
    expect(result.body).toEqual('Invalid file name');
  });

  it('should return 500 error if thrown exception', async () => {
    (ImportService as any).mockImplementation(() => {
      return {
        getS3ImportSignedUrl: () => {
          throw new Error('Some error');
        },
      };
    });

    const event: APIGatewayEvent = {
      queryStringParameters: {
        name: 'myfile.csv',
      },
    } as any;
    const context: Context = {} as any;
    const callback: Callback = {} as any;

    const result: any = await importProductsFile(event, context, callback);

    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual('Internal server error');
  });
});
