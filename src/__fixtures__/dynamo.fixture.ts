import {
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DeleteCommandInput,
  DeleteCommandOutput,
  GetCommandInput,
  GetCommandOutput,
  PutCommandInput,
  PutCommandOutput,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateCommandInput,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';

export const batchWriteCommandInput: BatchWriteCommandInput = {
  RequestItems: {
    MockTable: [
      {
        DeleteRequest: {
          Key: {
            pk: 1,
          },
        },
      },
    ],
  },
};

export const batchWriteCommandOutput: BatchWriteCommandOutput = {
  $metadata: {},
};

export const deleteCommandInput: DeleteCommandInput = {
  TableName: 'MockTable',
  Key: {
    pk: 1,
  },
};

export const deleteCommandOutput: DeleteCommandOutput = {
  $metadata: {},
};

export const getCommandInput: GetCommandInput = {
  TableName: 'MockTable',
  Key: {
    pk: 1,
  },
};

export const getCommandOutput: GetCommandOutput = {
  Item: {
    pk: 1,
  },
  $metadata: {},
};

export const putCommandInput: PutCommandInput = {
  TableName: 'MockTable',
  Item: {
    pk: 1,
  },
};

export const putCommandOutput: PutCommandOutput = {
  $metadata: {},
};

export const queryCommandInput: QueryCommandInput = {
  TableName: 'MockTable',
  KeyConditionExpression: 'pk = :pKey',
  ExpressionAttributeValues: {
    ':pKey': 1,
  },
};

export const queryCommandOutput: QueryCommandOutput = {
  Items: [
    {
      pk: 1,
    },
  ],
  $metadata: {},
};

export const scanCommandInput: ScanCommandInput = {
  TableName: 'MockTable',
};

export const scanCommandOutput: ScanCommandOutput = {
  Items: [
    {
      pk: 1,
    },
  ],
  $metadata: {},
};

export const updateCommandInput: UpdateCommandInput = {
  TableName: 'MockTable',
  Key: {
    pk: 1,
  },
  UpdateExpression: 'SET attribute = :value',
  ConditionExpression: 'pk = :pKey',
  ExpressionAttributeValues: {
    ':pKey': 1,
  },
  ReturnValues: 'ALL_NEW',
};

export const updateCommandOutput: UpdateCommandOutput = {
  Attributes: {
    pk: 1,
    attribute: 'value',
  },
  $metadata: {},
};
