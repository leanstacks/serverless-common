import {
  SQSClient,
  SQSClientConfig,
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageCommandOutput,
} from '@aws-sdk/client-sqs';

import { baseConfigValues as config } from './config.service';
import Logger from '../utils/logger';

const clientConfig: SQSClientConfig = {
  region: config.AWS_REGION,
};

Logger.debug('SQSService::creating new SQSClient', { data: { clientConfig } });
const sqsClient = new SQSClient(clientConfig);

/**
 * Send a message to a queue.
 * @param input - A `SendMessageCommandInput` object.
 * @returns A Promise which resolves to a `SendMessageCommandOutput` object.
 */
const sendMessage = (input: SendMessageCommandInput): Promise<SendMessageCommandOutput> => {
  return sqsClient.send(new SendMessageCommand(input));
};

/**
 * Use the `SQSService` to interact with AWS Simple Queue Service.
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/ | AWS SDK SQSClient}
 */
const SQSService = { sendMessage };

export default SQSService;
