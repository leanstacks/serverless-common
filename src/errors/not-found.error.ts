import httpStatus from 'http-status';

import { HttpError } from './http.error';

export class NotFoundError extends HttpError {
  name = 'NotFoundError';

  constructor(message?: string) {
    super(message || httpStatus[`${httpStatus.NOT_FOUND}_MESSAGE`], httpStatus.NOT_FOUND);
  }
}
