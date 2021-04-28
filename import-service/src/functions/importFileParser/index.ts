import { handlerPath } from '@libs/handlerResolver';
import { UPLOAD_FILE_PATH } from '../../constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'node-aws-import-file-service',
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: UPLOAD_FILE_PATH + '/',
          },
        ],
        existing: true,
      },
    },
  ],
};
