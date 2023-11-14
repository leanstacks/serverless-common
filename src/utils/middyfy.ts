import { Handler } from 'aws-lambda';
import middy, { MiddlewareObj, MiddyfiedHandler } from '@middy/core';

/**
 *
 * @param lambdaHandler - The AWS Lambda handler function.
 * @param middlewares - Optional. An array of middlewares which will be attached
 * to the handler in the order in which they appear in the array.
 * @returns A handler function wrapped in middleware to be used as the handler
 * function for the AWS Lambda function.
 */
export const middyfy = (
  lambdaHandler: Handler,
  middlewares?: MiddlewareObj[],
): MiddyfiedHandler => {
  // prepare the handler so that it may have middleware(s) attached
  const handler = middy(lambdaHandler);
  // attach middleware(s)
  middlewares?.forEach((middleware) => handler.use(middleware));
  // return the "middyfied" handler
  return handler;
};
