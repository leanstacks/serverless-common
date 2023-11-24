:house: [Home](/README.md) | :books: [Docs](../DOCS.md)

# DynamoDB Client Service

This document describes how to use the DynamoDB Client service component, `DynamoService`, to perform actions on the items within a table.

## How it works

The AWS SDK provides components which facilitate operations on DynamoDB tables. These components must be configured and instantiated before use. This boilerplate setup logic is encapsulated within the `DynamoService` component.

## Using `DynamoService`

The `DynamoService` wraps the `DynamoDBClient` and `DynamoDBDocumentClient` from the AWS SDK, exposing the functions which you need to interact with DynamoDB tables. Those functions include:

- batchWrite
- delete
- get
- put
- query
- scan
- update

`DynamoService` leverages the family of `CommandInput` types from the AWS SDK for the function parameters and return types. For example, the signature of the `get` function is:

```ts
get(input: GetCommandInput): Promise<GetCommandOutput>
```

For more information about the CommandInput and CommandOutput objects see the [`@aws-sdk/lib-dynamodb`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/) official documentation.

In the example below, the `find` function accepts an identifier and uses `DynamoService.get` to search the table for the item.

First, we get the `DynamoService` instance. `DynamoService` is a singleton to improve performance across invocations of the Lambda function.

```ts
const dynamoService: DynamoService = DynamoService.getInstance();
```

Then the service is used to fetch an item from the table by the table key.

```ts
async find(taskListId: string): Promise<TaskList | null> {
  const output = await this.dynamoService.get({
    TableName: config.TASK_LIST_TABLE,
    Key: {
      taskListId,
    },
  });

  if (output.Item) {
    return output.Item as TaskList;
  } else {
    // not found
    return null;
  }
}
```

Notice the shape of the input object to the `get` function is the `GetCommandInput` from the AWS SDK. Furthermore, the shape of the returned object is the `GetCommandOutput`. The same pattern applies to the other functions of `DynamoService`.

## Performance considerations

The Dynamo components are constructed and configured once, when the dynamo module is first loaded by the module loader. Furthermore, the components are preserved between function invocations. When other modules subsequently import the DynamoService, the component is loaded without constructing the client components again.
