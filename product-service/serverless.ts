import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
  plugins: ['serverless-webpack', 'serverless-openapi-documentation', 'serverless-dotenv-plugin'],
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
        Ref: '${env:SNS_TOPIC_ID}'
      },
      REGION: '${self:provider.region}'
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: [
              {
                'Fn::ImportValue': '${env:SQS_QUEUE_ID}' + 'Arn'
              }
            ],
          },
          {
            Effect: 'Allow',
            Action: 'sns:*',
            Resource: [
              {
                'Ref': '${env:SNS_TOPIC_ID}'
              }
            ],
          }
        ]
      }
    },
    region: 'eu-west-1',
  },
  resources: {
    Resources: {
      'CreateProductTopic': {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: '${env:SNS_TOPIC_NAME}'
        }
      },
      'CreateProductSubscription': {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'max.plavinskiy@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: '${env:SNS_TOPIC_ID}'
          },
          FilterPolicy: {
            "count": [
              {"numeric": [">=", 5]}
            ]
          }
        }
      },
      'CreateProductSubscription2': {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'mplavin@lenta.ru',
          Protocol: 'email',
          TopicArn: {
            Ref: '${env:SNS_TOPIC_ID}'
          },
          FilterPolicy: {
            "count": [
              {"numeric": ["<", 5]}
            ]
          }
        }
      }
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
};

module.exports = serverlessConfiguration;
