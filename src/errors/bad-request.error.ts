import httpStatus from 'http-status';

import { HttpError } from './http.error';

/**
 * `BadRequestError` extends `HttpError` creating a specialized Error class for the
 * Bad Request (400) HTTP response code.
 * @see {@link HttpError}
 */
export class BadRequestError extends HttpError {
  name = 'BadRequestError';

  constructor(message?: string) {
    super(message || httpStatus[`${httpStatus.BAD_REQUEST}_MESSAGE`], httpStatus.BAD_REQUEST);
  }
}
