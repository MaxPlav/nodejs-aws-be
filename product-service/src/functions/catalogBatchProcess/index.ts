import { handlerPath } from '@libs/handlerResolver';

import { SQS_QUEUE_BATCH_SIZE, SQS_QUEUE_ID } from '../../../src/constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: SQS_QUEUE_BATCH_SIZE,
        arn: {
          'Fn::GetAtt': [
            SQS_QUEUE_ID,
            'Arn'
          ]
        }
      },
    },
  ],
};
