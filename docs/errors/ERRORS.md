:house: [Home](/README.md) | :books: [Docs](../DOCS.md)

# Errors

This document describes how to use the family of `Error` classes within the `@leanstacks/serverless-common` package.

## How it works

The `@leanstacks/serverless-common` package provides a family of error classes which may be utilized within AWS Lambda functions to ensure that a consistent response is returned when exception scenarios occur.

## Using the errors

There are two base error classes: `ServiceError` and `HttpError`. Both extend `Error` and, therefore, both have `name` and `message` properties. Additional properties are included to provide more information.

### `ServiceError`

A `ServiceError` may be used in any type of AWS Lambda function. The error has the following properties:

- `name` -- The string "ServiceError".
- `message` -- A string message describing the error.
- `statusCode` -- Optional. A numeric [HTTP response status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- `code` -- Optional. A numeric value to convey further meaning to the API client regarding the cause of the error

A `ServiceError` may be constructed with either a string or an Error as the first parameter. The optional second parameter is the numeric `code`. And, the optional third parameter is the `statusCode`.

_Example: Throw a `ServiceError` with a message._

```ts
new ServiceError('Object not found in S3 bucket');
```

_Example: Throw a `ServiceError` with an error and code._

```ts
try {
  ...
} catch (err) {
  throw new ServiceError(err, 1001);
}
```

### `HttpError`

A `HttpError` and, more often, it's sub-classes are used in API Gateway Lambda functions. The error has the following properties:

- `name` -- The string "HttpError".
- `message` -- A string message describing the error.
- `statusCode` -- A numeric [HTTP response status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

A `HttpError` may be constructed with either a string or an Error as the first parameter and a status code as the second parameter.

_Example: Throw a `HttpError` with a message and status code._

```ts
new HttpError('Not found', 404);
```

_Example: Throw a `HttpError` with an error and status code._

```ts
try {
  ...
} catch (err) {
  throw new HttpError(err, 500);
}
```

However, it is more common to use one of the `HttpError` sub-classes:

- `BadRequestError`
- `ForbiddenError`
- `NotFoundError`

### `BadRequestError`

A `BadRequestError` extends `HttpError`. The error `name` is "BadRequestError" and the `statusCode` is 400.

The `BadRequestError` constructor accepts an optional string `message` parameter. When provided, this value is set to the error `message` property, otherwise, the default HTTP status message for HTTP 400 is used.

_Example: Throw a `BadRequestError` with the default message._

```ts
new BadRequestError();
```

_Example: Throw a `BadRequestError` with a custom message._

```ts
try {
  ...
} catch (err) {
  throw new BadRequestError(err.message);
}
```

### `ForbiddenError`

A `ForbiddenError` extends `HttpError`. The error `name` is "ForbiddenError" and the `statusCode` is 403.

The `ForbiddenError` constructor accepts an optional string `message` parameter. When provided, this value is set to the error `message` property, otherwise, the default HTTP status message for HTTP 403 is used.

_Example: Throw a `ForbiddenError` with the default message._

```ts
new ForbiddenError();
```

_Example: Throw a `ForbiddenError` with a custom message._

```ts
try {
  ...
} catch (err) {
  throw new ForbiddenError(err.message);
}
```

### `NotFoundError`

A `NotFoundError` extends `HttpError`. The error `name` is "NotFoundError" and the `statusCode` is 404.

The `NotFoundError` constructor accepts an optional string `message` parameter. When provided, this value is set to the error `message` property, otherwise, the default HTTP status message for HTTP 404 is used.

_Example: Throw a `NotFoundError` with the default message._

```ts
new NotFoundError();
```

_Example: Throw a `NotFoundError` with a custom message._

```ts
try {
  ...
} catch (err) {
  throw new NotFoundError(err.message);
}
```

## Example API client response

When any of the error family of classes is thrown from an API Gateway Lambda function, the `http-error-handler` middleware intercepts the error and, using the information within the error, creates an informative response for the API client. The response body payload is similar to the example below.

````json
{
  "name": "NotFoundError",
  "message": "The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.",
  "code": 404,
  "statusCode": 404
}```
````
