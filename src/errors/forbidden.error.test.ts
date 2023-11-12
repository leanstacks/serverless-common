import httpStatus from 'http-status';

import { ForbiddenError } from './forbidden.error';
import { HttpError } from './http.error';

describe('ForbiddenError', () => {
  it('should use constructor values', () => {
    const error = new ForbiddenError('message');

    expect(error).toBeDefined();
    expect(error.name).toBe('ForbiddenError');
    expect(error.message).toBe('message');
    expect(error.statusCode).toBe(403);
  });

  it('should have default message', () => {
    const error = new ForbiddenError();

    expect(error.message).toBe(httpStatus[`${httpStatus.FORBIDDEN}_MESSAGE`]);
  });

  it('should be instanceof HttpError', () => {
    const error = new ForbiddenError();

    expect(error instanceof HttpError).toBeTruthy();
  });
});
