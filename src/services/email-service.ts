import SQSService from './sqs-service';

/**
 * The addresses to which the email should be sent.
 */
export type EmailDestination = {
  to: string[];
  cc?: string[];
  bcc?: string[];
};

/**
 * An object containing data to populate the email template. The object keys
 * are strings and the values may be strings, numbers, or booleans.
 *
 * _Example:_
 * ```
 * {
 *   name: 'Joe Smith',
 *   age: 39,
 *   isEnabled: true
 * }
 * ```
 */
export type EmailTemplateData = Record<string, string | number | boolean>;

/**
 * The `Email` type describes the request to send an email to one or more
 * recipients (i.e. destinations).
 */
export type Email = {
  destinations: EmailDestination[];
  templateName: string;
  templateData?: EmailTemplateData;
};

/**
 * Sends an email message asynchronously. Provide the `email` and the AWS SQS
 * `queueUrl`. The `queueURL` is the LeanStacks Email microservice SQS Queue.
 * @param email - The `Email` object describing the email message.
 * @param queueUrl - The AWS SQS queue URL for the Email microservice.
 */
const send = async (email: Email, queueUrl: string): Promise<void> => {
  await SQSService.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({
      data: email.templateData,
      destinations: email.destinations,
      template: email.templateName,
    }),
  });
};

/**
 * Use the `EmailService` to send an email message. Messages are sent
 * asynchronously.
 */
const EmailService = { send };

export default EmailService;
