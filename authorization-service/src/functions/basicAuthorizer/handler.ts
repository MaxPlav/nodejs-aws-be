import 'source-map-support/register';
import {
  APIGatewayTokenAuthorizerHandler,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
  Callback
} from 'aws-lambda';

import { middyfy } from '@libs/lambda';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event: APIGatewayTokenAuthorizerEvent, _, cb: Callback<APIGatewayAuthorizerResult>
): Promise<any> => {
  console.log('Lambda invokation "basicAuthorizer": ', event);

  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
  }

  try {
    const authorizationToken = event.authorizationToken;

    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');

    const username = plainCreds[0];
    const password = plainCreds[1];

    console.log(`username=${username} and password=${password}`);
    const storedUserPassword = process.env[username];

    if (!storedUserPassword) {
      cb('Access Denied');
    }

    const effect =
      !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    cb(null, policy);
  } catch (e) {
    console.error('Lambda invokation "basicAuthorizer": ', e.message);
    cb('Unauthorized');
  }
};

const generatePolicy = (
  principalId,
  resource,
  effect = 'Allow'
): APIGatewayAuthorizerResult => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

export const main = middyfy(basicAuthorizer);
