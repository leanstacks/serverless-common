import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, ScheduledEvent } from 'aws-lambda';

import { middyfyAPIGateway, middyfyScheduled } from '../middyfy';

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
