import middy, { MiddlewareObj } from '@middy/core';

import Logger from '../utils/logger';

/**
 * Initialize the Logger. Adds event metadata to each logged event.
 * @returns Middleware to initialize the Logger.
 */
export const loggerInitializer = (): MiddlewareObj => {
  /**
   * Initialize the Logger before the handler is invoked.
   * @param request - Middy request context.
   */
  const loggerInitializerBefore: middy.MiddlewareFn = (request): void => {
    Logger.defaultMeta = { requestId: request.context.awsRequestId };
  };

  return { before: loggerInitializerBefore };
};
