import { ServiceError } from '../service.error';

describe('ServiceError', () => {
  it('should use constructor values', () => {
    const error = new ServiceError('message', 100, 101);

    expect(error).toBeDefined();
    expect(error.name).toBe('ServiceError');
    expect(error.message).toBe('message');
    expect(error.code).toBe(100);
    expect(error.statusCode).toBe(101);
  });

  it('should use default values', () => {
    const error = new ServiceError('message');

    expect(error).toBeDefined();
    expect(error.name).toBe('ServiceError');
    expect(error.message).toBe('message');
    expect(error.code).toBe(500);
    expect(error.statusCode).toBe(500);
  });

  it('should use message from Error', () => {
    const sourceError = new Error('source error message');
    const error = new ServiceError(sourceError);

    expect(error).toBeDefined();
    expect(error.message).toBe('source error message');
  });
});
