import { Request } from '@middy/core';

export const requestFixture: Request = {
  context: {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'functionName',
    functionVersion: 'functionVersion',
    invokedFunctionArn: 'invokedFunctionArn',
    memoryLimitInMB: 'memoryLimitInMB',
    awsRequestId: 'awsRequestId',
    logGroupName: 'logGroupName',
    logStreamName: 'logStreamName',
    getRemainingTimeInMillis: () => 1,
    done: () => 1,
    fail: () => 1,
    succeed: () => 1,
  },
  event: {},
  response: {},
  error: null,
  internal: {},
};
