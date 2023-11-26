import { Request } from '@middy/core';
import { jest } from '@jest/globals';

import { HttpError, ServiceError } from '../../errors';

import { httpErrorHandler } from '../error-handler-http';
import { requestFixture } from '../../__fixtures__/middy.fixture';

describe('HttpErrorHandler', () => {
  it('should create the middleware', () => {
    const middleware = httpErrorHandler();

    expect(middleware.before).not.toBeDefined();
    expect(middleware.after).not.toBeDefined();
    expect(middleware.onError).toBeDefined();
  });

  it('should do nothing when response has been written', () => {
    const response = JSON.stringify({ foo: 'bar' });
    const request: Request = {
      ...requestFixture,
      response,
    };

    const middleware = httpErrorHandler();

    expect(middleware.onError).toBeDefined();

    middleware.onError?.(request);

    expect(request.response).toBe(response);
  });

  it('should do nothing when no error', () => {
    const request: Request = {
      ...requestFixture,
    };
    delete request.response;

    const middleware = httpErrorHandler();

    expect(middleware.onError).toBeDefined();

    middleware.onError?.(request);

    expect(request.response).not.toBeDefined();
  });

  it('should write log when logger provided', () => {
    type loggerFn = (msg: string) => void;
    const mockLogger = jest.fn<loggerFn>();
    const request: Request = {
      ...requestFixture,
      error: new HttpError('message', 404),
    };
    delete request.response;

    const middleware = httpErrorHandler({
      defaultMessage: 'message',
      defaultStatusCode: 500,
      logger: mockLogger,
    });

    expect(middleware.onError).toBeDefined();

    middleware.onError?.(request);

    expect(mockLogger).toHaveBeenCalled();
  });

  it('should handle HttpError', () => {
    const expectedResponse = {
      body: JSON.stringify({ name: 'HttpError', message: 'message', code: 500, statusCode: 500 }),
      statusCode: 500,
    };
    const request: Request = {
      ...requestFixture,
      error: new HttpError('message', 500),
    };
    delete request.response;

    const middleware = httpErrorHandler();

    expect(middleware.onError).toBeDefined();

    middleware.onError?.(request);

    expect(request.response).toStrictEqual(expectedResponse);
  });

  it('should handle ServiceError', () => {
    const expectedResponse = {
      body: JSON.stringify({
        name: 'ServiceError',
        message: 'message',
        code: 500,
        statusCode: 500,
      }),
      statusCode: 500,
    };
    const request: Request = {
      ...requestFixture,
      error: new ServiceError('message'),
    };
    delete request.response;

    const middleware = httpErrorHandler();

    expect(middleware.onError).toBeDefined();

    middleware.onError?.(request);

    expect(request.response).toStrictEqual(expectedResponse);
  });

  it('should handle Error', () => {
    const expectedResponse = {
      body: JSON.stringify({
        name: 'Error',
        message: 'message',
        code: 500,
        statusCode: 500,
      }),
      statusCode: 500,
    };
    const request: Request = {
      ...requestFixture,
      error: new Error('message'),
    };
    delete request.response;

    const middleware = httpErrorHandler();

    expect(middleware.onError).toBeDefined();

    middleware.onError?.(request);

    expect(request.response).toStrictEqual(expectedResponse);
  });
});
