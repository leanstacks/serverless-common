import { SendMessageCommandInput, SendMessageCommandOutput } from '@aws-sdk/client-sqs';

export const sendMessageCommandInput: SendMessageCommandInput = {
  QueueUrl: 'queue-url',
  MessageBody: 'message-body',
};

export const sendMessageCommandOutput: SendMessageCommandOutput = {
  $metadata: {},
  MessageId: 'message-id',
};
