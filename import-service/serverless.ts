import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

import { AWS_REGION, IMPORT_BUCKET_NAME, SQS_QUEUE_ID, SQS_QUEUE_NAME } from './src/constants';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {
        Ref: SQS_QUEUE_ID
      },
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:ListBucket',
            Resource: `arn:aws:s3:::${IMPORT_BUCKET_NAME}`,
          },
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: `arn:aws:s3:::${IMPORT_BUCKET_NAME}/*`,
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: [
              {
                'Fn::GetAtt:': [ SQS_QUEUE_ID, 'Arn']
              }
            ],
          }
        ],
      },
    },
    region: AWS_REGION,
  },
  resources: {
    Resources: {
      [SQS_QUEUE_ID]: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: SQS_QUEUE_NAME
        }
      }
    }
  },
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
