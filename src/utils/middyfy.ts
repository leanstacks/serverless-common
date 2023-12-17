import middy from '@middy/core';
import eventNormalizer from '@middy/event-normalizer';
import httpEventNormalizer from '@middy/http-event-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  ScheduledEvent,
  SQSHandler,
  SNSHandler,
} from 'aws-lambda';
import { ObjectSchema } from 'joi';

import { validator } from '../middlewares/validator-joi';
import { httpErrorHandler } from '../middlewares/error-handler-http';

/**
 * The AWS Lambda handler function signature for API Gateway proxy events.
 */
export type APIGatewayHandlerFn = (
  event: APIGatewayProxyEvent,
  context: Context,
) => Promise<APIGatewayProxyResult>;

/**
 * The AWS Lambda handler function signature for Scheduled events
 * (e.g. cron events from AWS EventBridge).
 */
export type ScheduledHandlerFn = (event: ScheduledEvent, context: Context) => Promise<void>;

/**
 * Base options for `middyfy` functions.
 */
export type MiddyfyOptions<THandler> = {
  handler: THandler;
  logger?: (message: string) => void;
};

/**
 * Options for middyfied API Gateway event handler functions.
 */
export type APIGatewayMiddyfyOptions = MiddyfyOptions<APIGatewayHandlerFn> & {
  eventSchema?: ObjectSchema;
  defaultErrorMessage?: string;
  defaultErrorStatusCode?: number;
};

/**
 * Options for middyfied Scheduled event handler functions.
 */
export type ScheduledMiddyfyOptions = MiddyfyOptions<ScheduledHandlerFn> & {
  eventSchema?: ObjectSchema;
};

/**
 * Options for middyfied SNS event handler functions.
 */
export type SNSMiddyfyOptions = MiddyfyOptions<SNSHandler> & {
  eventSchema?: ObjectSchema;
};

/**
 * Options for middyfied SQS event handler functions.
 */
export type SQSMiddyfyOptions = MiddyfyOptions<SQSHandler> & {
  eventSchema?: ObjectSchema;
};

/**
 * Wraps an AWS Gateway proxy event handler function in middleware, returning the
 * AWS Lambda handler function.
 * @param options - The `APIGatewayMiddyfyOptions` object.
 * @returns A middyfied handler function.
 */
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

/**
 * Wraps a Scheduled event handler function in middleware, returning the
 * AWS Lambda handler function.
 * @param options - The `ScheduledMiddyfyOptions` object.
 * @returns A middyfied handler function.
 */
export const middyfyScheduled = (options: ScheduledMiddyfyOptions) => {
  return middy(options.handler).use(
    validator({ eventSchema: options.eventSchema, logger: options.logger }),
  );
};

/**
 * Wraps a SNS event handler function in middleware, returning the
 * AWS Lambda handler function.
 * @param options - The `SNSMiddyfyOptions` object.
 * @returns A middyfied handler function.
 */
export const middyfySNS = (options: SNSMiddyfyOptions) => {
  return middy(options.handler)
    .use(eventNormalizer())
    .use(validator({ eventSchema: options.eventSchema, logger: options.logger }));
};

/**
 * Wraps a SQS event handler function in middleware, returning the AWS Lambda
 * handler function.
 * @param options - The `SQSMiddyfyOptions` object.
 * @returns A middyfied handler function.
 */
export const middyfySQS = (options: SQSMiddyfyOptions) => {
  return middy(options.handler)
    .use(eventNormalizer())
    .use(validator({ eventSchema: options.eventSchema, logger: options.logger }));
};
