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

import { loggerInitializer } from '../middlewares/logger-initializer';
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
 * A Lambda function for invocation by another Lambda function.
 */
export type LambdaEvent<TEvent = unknown> = TEvent;

/**
 * A Lambda function result for invocation by another Lambda function.
 */
export type LambdaResult<TResult = unknown> = {
  status: number;
  statusText: string;
  data: TResult;
};

/**
 * The AWS Lambda handler function signature for Lambda events, i.e. Lambda to
 * Lambda function invocations.
 * Note: This is generally considered an anti-pattern. Search for another
 * design pattern before utilizing Lambda-to-Lambda.
 */
export type LambdaHandler<TEvent = unknown, TResult = unknown> = (
  event: LambdaEvent<TEvent>,
  context: Context,
) => Promise<LambdaResult<TResult>>;

/**
 * Base options for `middyfy` functions.
 */
export type MiddyfyOptions<THandler> = {
  handler: THandler;
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
 * Options for middyfied Lambda event handler functions.
 */
export type LambdaMiddyfyOptions<TEvent = unknown, TResult = unknown> = MiddyfyOptions<
  LambdaHandler<TEvent, TResult>
> & {
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
    .use(loggerInitializer())
    .use(httpEventNormalizer())
    .use(jsonBodyParser())
    .use(validator({ eventSchema: options.eventSchema }))
    .use(
      httpErrorHandler({
        defaultMessage: options.defaultErrorMessage,
        defaultStatusCode: options.defaultErrorStatusCode,
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
  return middy(options.handler)
    .use(loggerInitializer())
    .use(validator({ eventSchema: options.eventSchema }));
};

/**
 * Wraps a SNS event handler function in middleware, returning the
 * AWS Lambda handler function.
 * @param options - The `SNSMiddyfyOptions` object.
 * @returns A middyfied handler function.
 */
export const middyfySNS = (options: SNSMiddyfyOptions) => {
  return middy(options.handler)
    .use(loggerInitializer())
    .use(eventNormalizer())
    .use(validator({ eventSchema: options.eventSchema }));
};

/**
 * Wraps a SQS event handler function in middleware, returning the AWS Lambda
 * handler function.
 * @param options - The `SQSMiddyfyOptions` object.
 * @returns A middyfied handler function.
 */
export const middyfySQS = (options: SQSMiddyfyOptions) => {
  return middy(options.handler)
    .use(loggerInitializer())
    .use(eventNormalizer())
    .use(validator({ eventSchema: options.eventSchema }));
};

/**
 * Wraps a Lambda event handler function in middleware, returning the AWS
 * Lambda handler function.
 * Note: Lambda-to-Lambda invocations are considered an anti-pattern. Search
 * for an alternative approach.
 * @param options - The `LambdaMiddyfyOptions` object.
 * @returns A middyfied handler function.
 * @see {@link https://docs.aws.amazon.com/lambda/latest/operatorguide/functions-calling-functions.html}
 */
export const middyfyLambda = <TEvent, TResult>(options: LambdaMiddyfyOptions<TEvent, TResult>) => {
  return middy(options.handler)
    .use(loggerInitializer())
    .use(validator({ eventSchema: options.eventSchema }));
};
