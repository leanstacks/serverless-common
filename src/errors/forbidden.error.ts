import httpStatus from 'http-status';

import { HttpError } from './http.error';

export class ForbiddenError extends HttpError {
  name = 'ForbiddenError';

  constructor(message?: string) {
    super(message || httpStatus[`${httpStatus.FORBIDDEN}_MESSAGE`], httpStatus.FORBIDDEN);
  }
}
