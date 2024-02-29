import { jest } from '@jest/globals';

import SQSService from '../sqs-service';
import { emailFixture } from '../../__fixtures__/email-service.fixture';

import EmailService from '../email-service';

describe('EmailService', () => {
  const QUEUE_URL = 'queue-url';
  const sendSpy = jest.spyOn(SQSService, 'sendMessage');

  beforeEach(() => {
    sendSpy.mockResolvedValue({ $metadata: {} });
  });

  it('should be defined', () => {
    expect(EmailService).toBeDefined();
    expect(EmailService.send).toBeDefined();
  });

  it('should send email', async () => {
    await EmailService.send(emailFixture, QUEUE_URL);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify({
        data: emailFixture.templateData,
        destinations: emailFixture.destinations,
        template: emailFixture.templateName,
      }),
    });
  });
});
