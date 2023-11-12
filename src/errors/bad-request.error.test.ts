import httpStatus from 'http-status';

import { BadRequestError } from './bad-request.error';

describe('BadRequestError', () => {
  it('should have status code 400', () => {
    const error = new BadRequestError();

    expect(error.statusCode).toBe(400);
  });

  it('should have default message', () => {
    const error = new BadRequestError();

    expect(error.message).toBe(httpStatus[`${httpStatus.BAD_REQUEST}_MESSAGE`]);
  });

  it('should have name', () => {
    const error = new BadRequestError();

    expect(error instanceof BadRequestError).toBeTruthy();
    expect(error.name).toBe('BadRequestError');
  });
});
