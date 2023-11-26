import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';

import DynamoService from '../dynamo.service';
import {
  batchWriteCommandInput,
  batchWriteCommandOutput,
  deleteCommandInput,
  deleteCommandOutput,
  getCommandInput,
  getCommandOutput,
  putCommandInput,
  putCommandOutput,
  queryCommandInput,
  queryCommandOutput,
  scanCommandInput,
  scanCommandOutput,
  updateCommandInput,
  updateCommandOutput,
} from '../../__fixtures__/dynamo.fixture';

describe('DynamoService', () => {
  it('should be defined', () => {
    expect(DynamoService.batchWriteItems).toBeDefined();
    expect(DynamoService.deleteItem).toBeDefined();
    expect(DynamoService.getItem).toBeDefined();
    expect(DynamoService.putItem).toBeDefined();
    expect(DynamoService.queryItems).toBeDefined();
    expect(DynamoService.updateItem).toBeDefined();
  });

  it('should send BatchWriteCommand', async () => {
    const ddbMock = mockClient(DynamoDBDocumentClient);

    ddbMock.on(BatchWriteCommand).resolves(batchWriteCommandOutput);

    const output = await DynamoService.batchWriteItems(batchWriteCommandInput);

    expect(output).toBeDefined();
    expect(output).toEqual(batchWriteCommandOutput);
    expect(ddbMock).toHaveReceivedCommandWith(BatchWriteCommand, batchWriteCommandInput);
  });

  it('should send DeleteCommand', async () => {
    const ddbMock = mockClient(DynamoDBDocumentClient);

    ddbMock.on(DeleteCommand).resolves(deleteCommandOutput);

    const output = await DynamoService.deleteItem(deleteCommandInput);

    expect(output).toBeDefined();
    expect(output).toEqual(deleteCommandOutput);
    expect(ddbMock).toHaveReceivedCommandWith(DeleteCommand, deleteCommandInput);
  });

  it('should send GetCommand', async () => {
    const ddbMock = mockClient(DynamoDBDocumentClient);

    ddbMock.on(GetCommand).resolves(getCommandOutput);

    const output = await DynamoService.getItem(getCommandInput);

    expect(output).toBeDefined();
    expect(output).toEqual(getCommandOutput);
    expect(ddbMock).toHaveReceivedCommandWith(GetCommand, getCommandInput);
  });

  it('should send PutCommand', async () => {
    const ddbMock = mockClient(DynamoDBDocumentClient);

    ddbMock.on(PutCommand).resolves(putCommandOutput);

    const output = await DynamoService.putItem(putCommandInput);

    expect(output).toBeDefined();
    expect(output).toEqual(putCommandOutput);
    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, putCommandInput);
  });

  it('should send QueryCommand', async () => {
    const ddbMock = mockClient(DynamoDBDocumentClient);

    ddbMock.on(QueryCommand).resolves(queryCommandOutput);

    const output = await DynamoService.queryItems(queryCommandInput);

    expect(output).toBeDefined();
    expect(output).toEqual(queryCommandOutput);
    expect(ddbMock).toHaveReceivedCommandWith(QueryCommand, queryCommandInput);
  });

  it('should send ScanCommand', async () => {
    const ddbMock = mockClient(DynamoDBDocumentClient);

    ddbMock.on(ScanCommand).resolves(scanCommandOutput);

    const output = await DynamoService.scanItems(scanCommandInput);

    expect(output).toBeDefined();
    expect(output).toEqual(scanCommandOutput);
    expect(ddbMock).toHaveReceivedCommandWith(ScanCommand, scanCommandInput);
  });

  it('should send UpdateCommand', async () => {
    const ddbMock = mockClient(DynamoDBDocumentClient);

    ddbMock.on(UpdateCommand).resolves(updateCommandOutput);

    const output = await DynamoService.updateItem(updateCommandInput);

    expect(output).toBeDefined();
    expect(output).toEqual(updateCommandOutput);
    expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, updateCommandInput);
  });
});
