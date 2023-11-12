import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ObjectSchema } from 'joi';
import middy from '@middy/core';
import httpEventNormalizer from '@middy/http-event-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';

type ApiGatewayHandlerFn = (
  event: APIGatewayProxyEvent,
  context: Context,
) => Promise<APIGatewayProxyResult>;

export interface MiddyfyOptions<THandler> {
  handler: THandler;
  eventSchema?: ObjectSchema;
}

export const middyfyAPIGateway = (options: MiddyfyOptions<ApiGatewayHandlerFn>) => {
  return middy(options.handler).use(httpEventNormalizer()).use(jsonBodyParser());
};
