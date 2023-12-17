import { SendMessageCommandInput, SendMessageCommandOutput } from '@aws-sdk/client-sqs';

export const sendMessageCommandInput: SendMessageCommandInput = {
  QueueUrl: 'queue-url',
  MessageBody: 'message-body',
};

export const sendMessageCommandOuput: SendMessageCommandOutput = {
  $metadata: {},
  MessageId: 'message-id',
};
