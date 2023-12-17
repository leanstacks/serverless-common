:house: [Home](/README.md) | :books: [Docs](../DOCS.md)

# SQS Client Service

This document describes how to use the SQS Client service component, `SQSService`, to interact with message queues.

## How it works

The AWS SDK provides components which facilitate operations on SQS queues. These components must be configured and instantiated before use. This boilerplate setup logic is encapsulated within the `SQSService` component.

## Using `SQSService`

The `SQSService` wraps the `SQSClient` from the AWS SDK, exposing the functions which you need to interact with SQS queues. Those functions include:

- sendMessage

`SQSService` leverages the family of `CommandInput` types from the AWS SDK for the function parameters and return types. For example, the signature of the `sendMessage` function is:

```ts
sendMessage(input: SendMessageCommandInput): Promise<SendMessageCommandOutput>
```

For more information about the CommandInput and CommandOutput objects see the [`@aws-sdk/client-sqs`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/) official documentation.

In the example below, the `send` function accepts an identifier and uses `SQSService.sendMessage` to send a message to a queue.

First, we import the `SQSService`. `SQSService` is optimized for performance. It is configured once, the first time the module is imported. On subsequent uses, the module loader provides the pre-configured service.

```ts
import { SQSService } from '@leanstacks/serverless-common';
```

Then the service is used to send messages to an AWS SQS Queue.

```ts
async send(task: Task): Promise<void> {
  const output = await SQSService.sendMessage({
    QueueUrl: config.TASK_QUEUE_URL,
    MessageBody: JSON.stringify(task);
  });
  console.log(`sent message ${output.MessageId} to queue`);
}
```

Notice the shape of the input object to the `sendMessage` function is the `SendMessageCommandInput` from the AWS SDK. Furthermore, the shape of the returned object is the `SendMessageCommandOutput`.

## Performance considerations

The SQS components are constructed and configured once, when the `SQSService` module is first loaded by the module loader. If `SQSService` is used multiple times in a single function invocation, the previously instantiated and configured components are reused. Furthermore, the components are preserved between function invocations needing only to be created once during a Lambda function cold start.
