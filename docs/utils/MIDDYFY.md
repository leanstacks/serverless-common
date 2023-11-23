:house: [Home](/README.md) | :books: [Docs](../DOCS.md)

# Middyfy

This document describes how to create a serverless event handler component leveraging
shared components from the [`serverless-common`](/) package.

## Why middleware?

By applying a standard suite of configurable middleware to your AWS Lambda functions, you can skip the boilerplate code and focus on the business logic of the function.

## How it works

All AWS Lambda functions share the same handler function shape...

```ts
export type Handler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: Context,
  callback: Callback<TResult>,
) => void | Promise<TResult>;
```

Middy provides the ability to wrap AWS Lambda handler functions in middleware. Each middleware provides the ability to act on the event _before_ the handler, act on the result _after_ the handler, or to act on unhandled errors thrown from the handler.

Want to know more? Read the [official Middy guide for how middleware works](https://middy.js.org/docs/intro/how-it-works).

## Creating a simple API Gateway event handler

To create a simplistic API Gateway event handler without event validation, you will need to create two modules: the handler function and the middyfy wrapper.

Create the AWS Lambda Handler function with the usual signature...

> **NOTE:** Each handler function is located in a dedicated directory to allow the handler function and related middleware components to be bundled and exported in a single `index.ts`.

_/handlers/task-find/handler.ts_

```ts
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { NotFoundError } from '@leanstacks/serverless-common';
...

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  // parse request
  const taskListId: string = event.pathParameters?.taskListId ?? '';
  const requestor: string = event.requestContext.authorizer?.user_id ?? '';

  // perform business logic
  const taskDataService = new TaskDataService();
  const taskList = await taskDataService.find(taskListId, requestor);

  // create response
  if (taskList) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': config.ALLOW_ORIGIN,
      },
      body: JSON.stringify(taskList),
    };
  } else {
    throw new NotFoundError();
  }
};
```

Next, we need to _"middyfy"_ the handler function. This is just a fancy way of saying we are wrapping the handler function with middleware.

_/handlers/task-find/index.ts_

```ts
import { middyfyAPIGateway } from '@leanstacks/serverless-common';

import { handler } from './handler';

export const handle = middyfyAPIGateway({ handler });
```

The handler function appears much the same as what you may be writing already. So what is advantage? The magic happens in the `middyfyAPIGateway` function. This simple function wraps the handler in several middlewares.

First, the [`http-event-normalizer`](https://middy.js.org/docs/middlewares/http-event-normalizer) official Middy middleware ensures that all of the optional elements of an APIGatewayProxyEvent are defined even when empty.

Next, the [`http-json-body-parser`](https://middy.js.org/docs/middlewares/http-json-body-parser) official Middy middleware parses the HTTP request body converting it from a string of JSON into an object.

Then, the `validator-joi` middleware validates the APIGatewayProxyEvent with a Joi schema, when a schema is provided in the middleware options.

Finally, the `http-error-handler` middleware processes errors thrown from the handler function, creating a standardized response based upon the error type.

## Creating an API Gateway handler with event validation

In the section above, we discussed how to create an API Gateway event handler function in the most simplistic form. Let's add event validation to ensure that the request contains the required information and throw an error if it does not.

Building on the example from the previous section, simply create a [Joi](https://joi.dev/) schema.

_/handlers/task-find/schema.ts_

```ts
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as Joi from 'joi';

export const eventSchema = Joi.object<APIGatewayProxyEvent>({
  pathParameters: Joi.object({
    taskListId: Joi.string().required(),
  }),
  requestContext: Joi.object({
    authorizer: Joi.object({
      user_id: Joi.string().required(),
    }),
  }),
});
```

So that our middleware will validate the API Gateway event, we must pass the schema in the middleware options in `index.ts` as illustrated below.

```ts
import { middyfyAPIGateway } from '@leanstacks/serverless-common';

import { handler } from './handler';
import { eventSchema } from './schema';

export const handle = middyfyAPIGateway({ handler, eventSchema });
```

When an `eventSchema` is present in the middleware options, the Joi Validator middleware ensures that the event is valid. The middleware throws a ValidationError if it is invalid. The HTTP Error Handler knows how to handle a ValidationError, returning a response with status code 400 and an informative message.

Notice that nothing changed with the handler function itself!
