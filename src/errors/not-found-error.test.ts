import httpStatus from 'http-status';

import { NotFoundError } from './not-found.error';
import { HttpError } from './http.error';

describe('NotFoundError', () => {
  it('should use constructor values', () => {
    const error = new NotFoundError('message');

    expect(error).toBeDefined();
    expect(error.name).toBe('NotFoundError');
    expect(error.message).toBe('message');
    expect(error.statusCode).toBe(404);
  });

  it('should have default message', () => {
    const error = new NotFoundError();

    expect(error.message).toBe(httpStatus[`${httpStatus.NOT_FOUND}_MESSAGE`]);
  });

  it('should be instanceof HttpError', () => {
    const error = new NotFoundError();

    expect(error instanceof HttpError).toBeTruthy();
  });
});
