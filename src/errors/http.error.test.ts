import { HttpError } from './http.error';

describe('HttpError', () => {
  it('should use constructor values', () => {
    const error = new HttpError('message', 500);

    expect(error).toBeDefined();
    expect(error.message).toBe('message');
    expect(error.statusCode).toBe(500);
  });

  it('should use message from Error', () => {
    const sourceError = new Error('message from error');
    const error = new HttpError(sourceError, 500);

    expect(error).toBeDefined();
    expect(error.message).toBe('message from error');
    expect(error.statusCode).toBe(500);
  });
});
