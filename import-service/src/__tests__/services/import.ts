import { ImportService } from '../../services/import';

const mS3Instance = {
  getSignedUrlPromise: jest.fn(),
};

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => mS3Instance) };
});

describe('ImportService', function () {
  describe('getS3ImportSignedUrl', () => {

    it('should return a signed url', async () => {
      const filename = 'myfile.csv';
      mS3Instance.getSignedUrlPromise.mockResolvedValueOnce('someurl/' + filename);

      const service = new ImportService({});
      const result = await service.getS3ImportSignedUrl(filename);

      expect(result).toEqual('someurl/' + filename);
    });
  });
});
