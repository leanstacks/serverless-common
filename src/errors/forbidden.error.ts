import httpStatus from 'http-status';

import { HttpError } from './http.error';

/**
 * `Forbidden` extends `HttpError` creating a specialized Error class for the
 * Forbidden (403) HTTP response code.
 * @see {@link HttpError}
 */
export class ForbiddenError extends HttpError {
  name = 'ForbiddenError';

  constructor(message?: string) {
    super(message || httpStatus[`${httpStatus.FORBIDDEN}_MESSAGE`], httpStatus.FORBIDDEN);
  }
}
