import middy, { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { ServiceError } from '../errors/service.error';
import { HttpError } from '../errors/http.error';

export type HttpErrorHandlerOptions = {
  defaultMessage: string;
  defaultStatusCode: number;
  logger?(): void;
};

const DEFAULT_OPTIONS: HttpErrorHandlerOptions = {
  defaultMessage: 'Unhandled error',
  defaultStatusCode: 500,
};

export const httpErrorHandler = (
  opts?: HttpErrorHandlerOptions,
): MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  /**
   * Merged options.
   */
  const options = {
    ...DEFAULT_OPTIONS,
    ...opts,
  };

  /**
   * `ServiceError` type guard.
   * @param error An Error.
   * @returns Indicates if `error` is of type `ServiceError`.
   */
  const isServiceError = (error: Error | ServiceError): error is ServiceError => {
    return error instanceof ServiceError;
  };

  /**
   * `HttpError` type guard.
   * @param error An Error.
   * @returns Indicates if `error` is of type `HttpError`.
   */
  const isHttpError = (error: Error | HttpError): error is HttpError => {
    return error instanceof HttpError;
  };

  /**
   * Format response for unhandled error.
   * @param request - Middy request context.
   */
  const onError: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = (
    request,
  ): void => {
    if (request.response !== undefined) {
      // if response already written; do nothing
      return;
    }

    if (!request.error) {
      // no error; do nothing
      return;
    }

    const { error } = request;

    if (isHttpError(error)) {
      // type HttpError
      console.debug('middleware::error-handler::HttpError', error);
      request.response = {
        statusCode: error.statusCode || options.defaultStatusCode,
        body: JSON.stringify({
          name: error.name,
          message: error.message || options.defaultMessage,
          code: error.statusCode || options.defaultStatusCode,
          statusCode: error.statusCode || options.defaultStatusCode,
        }),
      };
    } else if (isServiceError(error)) {
      // type ServiceError
      console.debug('middleware::error-handler::ServiceError', error);
      request.response = {
        statusCode: error.statusCode || options.defaultStatusCode,
        body: JSON.stringify({
          name: error.name,
          message: error.message || options.defaultMessage,
          code: error.code || options.defaultStatusCode,
          statusCode: error.statusCode || options.defaultStatusCode,
        }),
      };
    } else {
      // any other type of Error
      console.debug('middleware::error-handler::Error', error);
      request.response = {
        statusCode: options.defaultStatusCode,
        body: JSON.stringify({
          name: error.name,
          message: error.message || options.defaultMessage,
          code: options.defaultStatusCode,
          statusCode: options.defaultStatusCode,
        }),
      };
    }
  };

  return {
    onError,
  };
};
