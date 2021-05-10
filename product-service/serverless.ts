import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

import { AWS_REGION, SQS_QUEUE_ID, SNS_TOPIC_ID, SNS_TOPIC_NAME, SNS_SUBSCRIPTION_ID } from './src/constants';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-openapi-documentation'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SNS_ARN: {
        ref: SNS_TOPIC_ID
      }
    },
    lambdaHashingVersion: '20201221',
    region: AWS_REGION,
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: [
              {
                'Fn::GetAtt:': [ SQS_QUEUE_ID, 'Arn']
              }
            ],
          },
          {
            Effect: 'Allow',
            Action: 'sns:*',
            Resource: [
              {
                'Ref': SNS_TOPIC_ID
              }
            ],
          }
        ]
      }
    }
  },
  resources: {
    Resources: {
      [SNS_TOPIC_ID]: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: SNS_TOPIC_NAME
        }
      },
      [SNS_SUBSCRIPTION_ID]: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'max.plavinskiy@gmail.com',
          Protocol: 'email',
          TopicArn: {
            ref: SNS_TOPIC_ID
          }
        }
      }
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
};

module.exports = serverlessConfiguration;
