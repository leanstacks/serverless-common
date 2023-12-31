:house: [Home](/README.md) | :books: [Docs](../DOCS.md)

# Middyfy

This document describes how to create a serverless event handler component leveraging
shared components from the `serverless-common` package.

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

Middy provides the ability to wrap AWS Lambda handler functions in middleware. Each middleware provides the ability to act on the event _before_ the handler, act on the result _after_ the handler, or to act on unhandled errors thrown from the handler or middleware.

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

The `logger-initializer` middleware adds AWS Lambda Context metadata to the logger so that all messages may be correlated to a specific Lambda function invocation.

The [`http-event-normalizer`](https://middy.js.org/docs/middlewares/http-event-normalizer) official Middy middleware ensures that all of the optional elements of an APIGatewayProxyEvent are defined even when empty.

The [`http-json-body-parser`](https://middy.js.org/docs/middlewares/http-json-body-parser) official Middy middleware parses the HTTP request body converting it from a string of JSON into an object.

The `validator-joi` middleware validates the APIGatewayProxyEvent with a Joi schema, when a schema is provided in the middleware options.

The `http-error-handler` middleware processes errors thrown from the handler function, creating a standardized response based upon the error type.

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

## Creating a Scheduled event handler

Use a Scheduled event handler when you need to run a Lambda function on a cron schedule.

To create a Scheduled event handler, you will need to create two modules: the handler function and the middyfy wrapper.

Create the AWS Lambda Handler function with the usual signature...

_/handlers/task-scheduled/handler.ts_

```ts
import { Context, ScheduledEvent } from 'aws-lambda';
...

export const handler = async (event: ScheduledEvent, context: Context): Promise<void> => {
  try {
    // perform business logic
    await TaskService.sendReminders();

  } catch (error) {
    Logger.error('Failed to send task reminders. Detail:', error);
    throw new ServiceError(error);
  }
};
```

Next, we need to _"middyfy"_ the handler function. This is just a fancy way of saying we are wrapping the handler function with middleware.

_/handlers/task-scheduled/index.ts_

```ts
import { middyfyScheduled } from '@leanstacks/serverless-common';

import { handler } from './handler';

export const handle = middyfyScheduled({ handler });
```

## Creating a SNS event handler

Use a SNS event handler to process events from an AWS Simple Notification Service (SNS) topic.

To create a SNS event handler, you will need to create two modules: the handler function and the middyfy wrapper.

Create the AWS Lambda Handler function with the usual signature...

_/handlers/task-sns/handler.ts_

```ts
import { Context, SNSEvent } from 'aws-lambda';
...

export const handler = async (event: SNSEvent, context: Context): Promise<void> => {
  try {
    // perform business logic
    const promises = map(event.Records, (record) => {
      const taskToCreate = record.Sns.Message as Task;
      return TaskService.create(taskToCreate);
    });
    const tasks:Task[] = await Promise.all(promises);

  } catch (error) {
    Logger.error('Failed to create tasks. Detail:', error);
    throw new ServiceError(error);
  }
};
```

Next, we need to _"middyfy"_ the handler function. This is just a fancy way of saying we are wrapping the handler function with middleware.

_/handlers/task-sns/index.ts_

```ts
import { middyfySNS } from '@leanstacks/serverless-common';

import { handler } from './handler';

export const handle = middyfySNS({ handler });
```

The handler is wrapped with two middlewares.

1. The `logger-initializer` middleware adds AWS Lambda Context metadata to the logger so that all messages may be correlated to a specific Lambda function invocation.

1. The `event-normalizer` middleware performs a JSON parse on the `Message`.
1. The `validator` middleware will validate the event when an `eventSchema` is provided in the options.

## Creating a SQS event handler

Use a SQS event handler to process events from an AWS Simple Queue Service (SQS) topic.

To create a SQS event handler, you will need to create two modules: the handler function and the middyfy wrapper. You may optionally create a `schema.ts` module which provides a Joi validation schema for the `SQSEvent`.

Create the AWS Lambda Handler function with the usual signature...

_/handlers/task-sqs/handler.ts_

```ts
import { Context, SQSEvent, SQSBatchResponse } from 'aws-lambda';
...

export const handler = async (event: SNSEvent, context: Context): Promise<SQSBatchResponse | void> => {
  try {
    // perform business logic
    const promises = map(event.Records, (record) => {
      const taskToCreate = record.body as Task;
      return TaskService.create(taskToCreate);
    });

    const response:SQSBatchResponse = {};
    Promise.allSettled(promises)
      .then((values) =>  {
        response.batchItemFailures = map(values, (value) => {
          if (value.status === 'rejected') {
            return { itemIdentifier: value.reason }
          }
        })
      });

    return response;
  } catch (error) {
    Logger.error('Failed to create tasks. Detail:', error);
    throw new ServiceError(error);
  }
};
```

Next, we need to _"middyfy"_ the handler function. This is just a fancy way of saying we are wrapping the handler function with middleware.

_/handlers/task-sqs/index.ts_

```ts
import { middyfySQS } from '@leanstacks/serverless-common';

import { handler } from './handler';

export const handle = middyfySQS({ handler });
```

The handler is wrapped with two middlewares.

1. The `logger-initializer` middleware adds AWS Lambda Context metadata to the logger so that all messages may be correlated to a specific Lambda function invocation.
1. The `event-normalizer` middleware performs a JSON parse on the `body`.
1. The `validator` middleware will validate the event when an `eventSchema` is provided in the options.

## Creating a Lambda event handler

Use a Lambda event handler to process events from direct invocations from another Lambda function.

> **NOTE:** This is generally considered to be an anti-pattern in serverless application design. See [Lambda functions calling Lambda functions](https://docs.aws.amazon.com/lambda/latest/operatorguide/functions-calling-functions.html) in the AWS Lambda guide. Consider SQS queues or Step Functions as an alternative.

To create a Lambda event handler, you will need to create two modules: the handler function and the middyfy wrapper. You may optionally create a `schema.ts` module which provides a Joi validation schema for the `LambdaEvent`.

Create the AWS Lambda Handler function with the usual signature...

_/handlers/task-lambda/handler.ts_

```ts
import { Context } from 'aws-lambda';
import { LambdaEvent, LambdaResult, middyfyLambda } from '@leanstacks/serverless-common';
...

type FindTaskEvent = {
  taskId: string;
};

type FindTaskResult = {
  task?: Task;
};

export const handler = async (
  event: LambdaEvent<FindTaskEvent>,
  context: Context,
): Promise<LambdaResult<FindTaskResult>> => {
  try {
    // handle request
    const { taskId } = event;
    const task = await TaskService.findById(taskId);

    // format and return response
    if (task) {
      return {
        status: 200,
        statusText: 'OK',
        data: { task },
      };
    } else {
      return {
        status: 404,
        statusText: 'Not Found',
        data: {},
      };
    }
  } catch (error) {
    Logger.warn(`Failed to find Task. Detail: ${error}`);
    return {
      status: 500,
      statusText: `${error}`,
      data: {},
    };
  }
};
```

Next, we need to _"middyfy"_ the handler function. This is just a fancy way of saying we are wrapping the handler function with middleware.

_/handlers/task-lambda/index.ts_

```ts
import { middyfyLambda } from '@leanstacks/serverless-common';

import { handler } from './handler';

export const handle = middyfyLambda({ handler });
```

The handler is wrapped with one middleware.

1. The `logger-initializer` middleware adds AWS Lambda Context metadata to the logger so that all messages may be correlated to a specific Lambda function invocation.
1. The `validator` middleware will validate the event when an `eventSchema` is provided in the options.
