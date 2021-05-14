import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  reservedConcurrency: 1,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          'Fn::ImportValue': 'CatalogItemsQueueArn'
        }
      },
    },
  ],
};
