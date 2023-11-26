/**
 * The `ServiceError` class extends `Error` providing additional, standardized attributes
 * for AWS Lambda functions. The attributes include: `code` and `statusCode`.
 */
export class ServiceError extends Error {
  name = 'ServiceError';
  code = 500;
  statusCode = 500;

  constructor(messageOrError: string | Error, code?: number, statusCode?: number) {
    super();
    this.code = code || 500;
    this.statusCode = statusCode || 500;
    if (typeof messageOrError === 'string') {
      this.message = messageOrError;
    }
    if (messageOrError instanceof Error) {
      this.message = messageOrError.message;
    }
  }
}
