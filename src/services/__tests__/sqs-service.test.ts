import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';

import SQSService from '../sqs-service';
import { sendMessageCommandInput, sendMessageCommandOuput } from '../../__fixtures__/sqs.fixture';

describe('SQSService', () => {
  it('should be defined', () => {
    expect(SQSService.sendMessage).toBeDefined();
  });

  it('should send SendMessageCommand', async () => {
    const sqsMock = mockClient(SQSClient);

    sqsMock.on(SendMessageCommand).resolves(sendMessageCommandOuput);

    const output = await SQSService.sendMessage(sendMessageCommandInput);

    expect(output).toBeDefined();
    expect(output).toEqual(sendMessageCommandOuput);
    expect(sqsMock).toHaveReceivedCommandWith(SendMessageCommand, sendMessageCommandInput);
  });
});
