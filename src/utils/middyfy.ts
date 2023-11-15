import middy from '@middy/core';
import httpEventNormalizer from '@middy/http-event-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, ScheduledEvent } from 'aws-lambda';
import { ObjectSchema } from 'joi';

import { validator } from '../middlewares/validator-joi';
import { httpErrorHandler } from '../middlewares/error-handler-http';

export type APIGatewayHandlerFn = (
  event: APIGatewayProxyEvent,
  context: Context,
) => Promise<APIGatewayProxyResult>;

export type ScheduledHandlerFn = (event: ScheduledEvent, context: Context) => Promise<void>;

export type MiddyfyOptions<THandler> = {
  handler: THandler;
  logger?: (message: string) => void;
};

export type APIGatewayMiddyfyOptions = MiddyfyOptions<APIGatewayHandlerFn> & {
  eventSchema?: ObjectSchema;
  defaultErrorMessage?: string;
  defaultErrorStatusCode?: number;
};

export type ScheduledMiddyfyOptions = MiddyfyOptions<ScheduledHandlerFn> & {
  eventSchema?: ObjectSchema;
};

export const middyfyAPIGateway = (options: APIGatewayMiddyfyOptions) => {
  return middy(options.handler)
    .use(httpEventNormalizer())
    .use(jsonBodyParser())
    .use(validator({ eventSchema: options.eventSchema, logger: options.logger }))
    .use(
      httpErrorHandler({
        defaultMessage: options.defaultErrorMessage,
        defaultStatusCode: options.defaultErrorStatusCode,
        logger: options.logger,
      }),
    );
};

export const middyfyScheduled = (options: ScheduledMiddyfyOptions) => {
  return middy(options.handler).use(
    validator({ eventSchema: options.eventSchema, logger: options.logger }),
  );
};
