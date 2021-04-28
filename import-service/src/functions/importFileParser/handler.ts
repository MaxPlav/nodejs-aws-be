import 'source-map-support/register';

import { S3Handler, S3Event } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';
import { ImportService } from '../../services';

import { AWS_REGION, IMPORT_BUCKET_NAME, UPLOAD_FILE_PATH, PARSE_FILE_PATH } from '../../constants';

const importFileParser: S3Handler = async (event: S3Event): Promise<void> => {
  console.log('Lambda invokation "importFileParser": ', event);
  try {
    const importService = new ImportService({
      bucketName: IMPORT_BUCKET_NAME,
      region: AWS_REGION,
    });

    for (const item of event.Records) {
      const filePath = item.s3.object.key;
      await importService.parseFile(filePath);
      await importService.moveFile(filePath, UPLOAD_FILE_PATH, PARSE_FILE_PATH);
    }
  } catch (e) {
    console.error('Lambda invokation "importFileParser": ', e.message);
  }
};

export const main = middyfy(importFileParser);
