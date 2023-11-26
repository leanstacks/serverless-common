/**
 * The `HttpError` class extends `Error` providing additional, standardized attributes
 * for AWS Lambda functions. The attributes include: `statusCode`.
 */
export class HttpError extends Error {
  name = 'HttpError';
  statusCode = 500;

  constructor(messageOrError: string | Error, statusCode: number) {
    super();
    this.statusCode = statusCode;
    if (typeof messageOrError === 'string') {
      this.message = messageOrError;
    }
    if (messageOrError instanceof Error) {
      this.message = messageOrError.message;
    }
  }
}
