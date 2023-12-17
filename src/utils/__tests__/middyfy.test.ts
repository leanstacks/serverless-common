import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  SNSEvent,
  SQSBatchResponse,
  SQSEvent,
  ScheduledEvent,
} from 'aws-lambda';

import {
  LambdaEvent,
  LambdaResult,
  middyfyAPIGateway,
  middyfyLambda,
  middyfySNS,
  middyfySQS,
  middyfyScheduled,
} from '../middyfy';

describe('middyfyAPIGateway', () => {
  const handlerFn = async (
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    return { statusCode: 200, body: '' };
  };

  it('should midfyfyAPIGateway', () => {
    const handler = middyfyAPIGateway({ handler: handlerFn });

    expect(handler).toBeDefined();
  });
});

describe('middyfyScheduled', () => {
  const handlerFn = async (event: ScheduledEvent, context: Context): Promise<void> => {};

  it('should middyfyScheduled', () => {
    const handler = middyfyScheduled({ handler: handlerFn });

    expect(handler).toBeDefined();
  });
});

describe('middyfySNS', () => {
  const handlerFn = async (event: SNSEvent, context: Context): Promise<void> => {};

  it('should middyfySNS', () => {
    const handler = middyfySNS({ handler: handlerFn });

    expect(handler).toBeDefined();
  });
});

describe('middyfySQS', () => {
  const handlerFn = async (event: SQSEvent, context: Context): Promise<SQSBatchResponse> => {
    return {
      batchItemFailures: [{ itemIdentifier: 'messageId' }],
    };
  };

  it('should middyfySQS', () => {
    const handler = middyfySQS({ handler: handlerFn });

    expect(handler).toBeDefined();
  });
});

describe('middyfyLambda', () => {
  const handlerFn = async (event: LambdaEvent, context: Context): Promise<LambdaResult> => {
    return {
      status: 200,
      statusText: 'OK',
      data: 'test',
    };
  };

  it('should middyfyLambda', () => {
    const handler = middyfyLambda({ handler: handlerFn });

    expect(handler).toBeDefined();
  });
});
