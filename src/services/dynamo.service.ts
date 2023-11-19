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

import { lambdaEnv } from './config.service';

const dynamoDbClientConfig: DynamoDBClientConfig = {
  region: lambdaEnv.AWS_REGION,
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

export class DynamoService {
  private static instance: DynamoService;
  private client: DynamoDBDocumentClient;

  private constructor() {
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient(dynamoDbClientConfig),
      translateConfig,
    );
  }

  public static getInstance() {
    if (!DynamoService.instance) {
      DynamoService.instance = new DynamoService();
    }
    return DynamoService.instance;
  }

  batchWrite(input: BatchWriteCommandInput): Promise<BatchWriteCommandOutput> {
    return this.client.send(new BatchWriteCommand(input));
  }

  delete(input: DeleteCommandInput): Promise<DeleteCommandOutput> {
    return this.client.send(new DeleteCommand(input));
  }

  get(input: GetCommandInput): Promise<GetCommandOutput> {
    return this.client.send(new GetCommand(input));
  }

  put(input: PutCommandInput): Promise<PutCommandOutput> {
    return this.client.send(new PutCommand(input));
  }

  query(input: QueryCommandInput): Promise<QueryCommandOutput> {
    return this.client.send(new QueryCommand(input));
  }

  scan(input: ScanCommandInput): Promise<ScanCommandOutput> {
    return this.client.send(new ScanCommand(input));
  }

  update(input: UpdateCommandInput): Promise<UpdateCommandOutput> {
    return this.client.send(new UpdateCommand(input));
  }
}
