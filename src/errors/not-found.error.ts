import httpStatus from 'http-status';

import { HttpError } from './http.error';

/**
 * `NotFoundError` extends `HttpError` creating a specialized Error class for the
 * Not Found (404) HTTP response code.
 * @see {@link HttpError}
 */
export class NotFoundError extends HttpError {
  name = 'NotFoundError';

  constructor(message?: string) {
    super(message || httpStatus[`${httpStatus.NOT_FOUND}_MESSAGE`], httpStatus.NOT_FOUND);
  }
}
