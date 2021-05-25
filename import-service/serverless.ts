import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    dotenv: {
      dotenvParser: 'dotenv.config.js',
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
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
        Ref: '${env:SQS_QUEUE_ID}'
      },
      REGION: '${self:provider.region}'
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:ListBucket',
            Resource: 'arn:aws:s3:::${env:IMPORT_BUCKET_NAME}',
          },
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: 'arn:aws:s3:::${env:IMPORT_BUCKET_NAME}/*',
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: [
              {
                'Fn::GetAtt': [ '${env:SQS_QUEUE_ID}', 'Arn']
              }
            ],
          }
        ],
      },
    },
    region: 'eu-west-1',
  },
  resources: {
    Resources: {
      'CatalogItemsQueue': {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: '${env:SQS_QUEUE_NAME}'
        }
      }
    },
    Outputs: {
      'CatalogItemsQueueArn': {
        Value: {
          'Fn::GetAtt': [ '${env:SQS_QUEUE_ID}', 'Arn']
        },
        Export: {
          Name: '${env:SQS_QUEUE_ID}' + 'Arn'
        }
      },
      'CatalogItemsQueueUrl': {
        Value: {
          'Ref': '${env:SQS_QUEUE_ID}',
        },
        Export: {
          Name: '${env:SQS_QUEUE_ID}' + 'Url'
        }
      }
    },
  },
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
