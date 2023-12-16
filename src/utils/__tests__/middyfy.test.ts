import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  SNSEvent,
  ScheduledEvent,
} from 'aws-lambda';

import { middyfyAPIGateway, middyfySNS, middyfyScheduled } from '../middyfy';

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
