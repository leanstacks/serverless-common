import httpStatus from 'http-status';

import { BadRequestError } from './bad-request.error';
import { HttpError } from './http.error';

describe('BadRequestError', () => {
  it('should use constructor values', () => {
    const error = new BadRequestError('message');

    expect(error).toBeDefined();
    expect(error.name).toBe('BadRequestError');
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('message');
  });

  it('should have default message', () => {
    const error = new BadRequestError();

    expect(error.message).toBe(httpStatus[`${httpStatus.BAD_REQUEST}_MESSAGE`]);
  });

  it('should be instanceof HttpError', () => {
    const error = new BadRequestError();

    expect(error instanceof HttpError).toBeTruthy();
  });
});
