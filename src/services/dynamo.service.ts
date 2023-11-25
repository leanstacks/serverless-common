import {
  BatchWriteCommandOutput,
  BatchWriteCommand,
  BatchWriteCommandInput,
  DeleteCommand,
  DeleteCommandInput,
  DeleteCommandOutput,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
  DynamoDBDocumentClient,
  TranslateConfig,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

import { lambdaConfigValues as config } from './config.service';

const dynamoDbClientConfig: DynamoDBClientConfig = {
  region: config.AWS_REGION,
};

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: true,
};
const unmarshallOptions = {
  wrapNumbers: false,
};
const translateConfig: TranslateConfig = { marshallOptions, unmarshallOptions };

/**
 * Create a DynamoDBDocumentClient. This will be created once during AWS Lambda function
 * cold start and placed in the module loader. It will be reused across function invocations.
 */
const documentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient(dynamoDbClientConfig),
  translateConfig,
);

/**
 * Modify a DynamoDB Table with a batch of Put and/or Delete operations.
 * @param input A `BatchWriteCommandInput` object.
 * @returns A Promise which resolves to a `BatchWriteCommandOputput` object.
 */
const batchWriteItems = (input: BatchWriteCommandInput): Promise<BatchWriteCommandOutput> => {
  return documentClient.send(new BatchWriteCommand(input));
};

/**
 * Delete a single item from a table.
 * @param input A `DeleteCommandInput` object.
 * @returns A Promise which resolves to a `DeleteCommandOutput` object.
 */
const deleteItem = (input: DeleteCommandInput): Promise<DeleteCommandOutput> => {
  return documentClient.send(new DeleteCommand(input));
};

/**
 * Get a single item from a table.
 * @param input A `GetCommandInput` object.
 * @returns A Promise which resolves to a `GetCommandOutput` object.
 */
const getItem = (input: GetCommandInput): Promise<GetCommandOutput> => {
  return documentClient.send(new GetCommand(input));
};

/**
 * Creates or replaces a single item in a table.
 * @param input A `PutCommandInput` object.
 * @returns A Promise which resolves to a `PutCommandOutput` object.
 */
const putItem = (input: PutCommandInput): Promise<PutCommandOutput> => {
  return documentClient.send(new PutCommand(input));
};

/**
 * Searches a table for items matching query criteria.
 * @param input A `QueryCommandInput` object.
 * @returns A Promise which resolves to a `QueryCommandOutput` object.
 */
const queryItems = (input: QueryCommandInput): Promise<QueryCommandOutput> => {
  return documentClient.send(new QueryCommand(input));
};

/**
 * Returns all items from a table with optional filter critera.
 * @param input A `ScanCommandInput` object.
 * @returns A Promise which resolves to a `ScanCommandOutput` object.
 */
const scanItems = (input: ScanCommandInput): Promise<ScanCommandOutput> => {
  return documentClient.send(new ScanCommand(input));
};

/**
 * Edits the attributes of an existing item or creates a new item if none exists. Use
 * conditional updates to prevent undesired item creation.
 * @param input An `UpdateCommandInput` object.
 * @returns A Promise which resolves to an `UpdateCommandOutput` object.
 */
const updateItem = (input: UpdateCommandInput): Promise<UpdateCommandOutput> => {
  return documentClient.send(new UpdateCommand(input));
};

/**
 * A `DynamoClient` provides operations for accessing and mutating one or more Items
 * within an AWS DynamoDB Table.
 */
type DynamoClient = {
  batchWriteItems: (input: BatchWriteCommandInput) => Promise<BatchWriteCommandOutput>;
  deleteItem: (input: DeleteCommandInput) => Promise<DeleteCommandOutput>;
  getItem: (input: GetCommandInput) => Promise<GetCommandOutput>;
  putItem: (input: PutCommandInput) => Promise<PutCommandOutput>;
  queryItems: (input: QueryCommandInput) => Promise<QueryCommandOutput>;
  scanItems: (input: ScanCommandInput) => Promise<ScanCommandOutput>;
  updateItem: (input: UpdateCommandInput) => Promise<UpdateCommandOutput>;
};

/**
 * Use the `DynamoService` to access or mutate Items within an AWS DynamoDB Table.
 */
const DynamoService: DynamoClient = {
  batchWriteItems,
  deleteItem,
  getItem,
  putItem,
  queryItems,
  scanItems,
  updateItem,
};

export default DynamoService;
