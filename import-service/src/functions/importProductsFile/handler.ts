import 'source-map-support/register';

import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda';

import { formatJSONResponse, formatJSONErrorResponse } from '../../libs/apiGateway';
import { middyfy } from '../../libs/lambda';

import { ImportService } from '../../services';

import { REGION, IMPORT_BUCKET_NAME, UPLOAD_FILE_PATH } from '../../config';

export const importProductsFile: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  console.log('Lambda invokation "importProductsFile": ', event);

  const fileName = event.queryStringParameters.name
  if (!fileName) {
    // TODO: define validation criteria
    return formatJSONErrorResponse('Invalid file name', 422);
  }

  try {
    const importService = new ImportService({
      bucketName: IMPORT_BUCKET_NAME,
      region: REGION,
    });
    // create signed url
    const filePath = `${UPLOAD_FILE_PATH}/${fileName}`;
    const signedUrl = await importService.getS3ImportSignedUrl(filePath);
  
    return formatJSONResponse({
      url: signedUrl
    });
  } catch (e) {
    console.error('Lambda invokation "importProductsFile": ', e.message);
    return formatJSONErrorResponse('Internal server error');
  }
}

export const main = middyfy(importProductsFile);
