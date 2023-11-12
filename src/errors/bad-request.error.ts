import httpStatus from 'http-status';

import { HttpError } from './http.error';

export class BadRequestError extends HttpError {
  name = 'BadRequestError';

  constructor(message?: string) {
    super(message || httpStatus[`${httpStatus.BAD_REQUEST}_MESSAGE`], httpStatus.BAD_REQUEST);
  }
}
