:house: [Home](/README.md) | :books: [Docs](../DOCS.md)

# Email Service

This document describes how to use the Email service component, `EmailService`, to send email messages.

## How it works

There is an Email microservice within the LeanStacks ecosystem. This microservice encapsulates all of the logic to actually send transactional emails. The email microservice receives requests to create and send emails from a AWS SQS Queue.

When another component needs to send an email, it simply needs to send a message to that Queue.

## Using `EmailService`

The `EmailService` uses the `SQSService` to send a message to the email queue. The message bodies must contain all of the information needed by the Email microservice to create the email message.

To send an email message you will need:

- The SQS Queue URL for the LeanStacks Email Microservice
- An AWS SES email template
- The `EmailService` from `@leanstacks/serverless-common`

### The email queue

The LeanStacks email microservice publishes a CloudFormation output variable containing the URL of the AWS SQS queue to which it listens for requests. In Serverless Framework specifications, that CloudFormation variable is referenced as illustrated below.

```yaml
params:
  default:
    emailResourcesStack: ls-service-email-resources-${sls:stage}

...omitted for brevity...

provider:
  environment:
    EMAIL_QUEUE_URL: ${cf:${param:emailResourcesStack}.BulkTemplatedEmailQueueUrl}
```

First, the email microservice CloudFormation stack name is referenced in the parameters. Then an environment variable is created which references the stack output variable.

### The SES email template

The LeanStacks email microservice sends email messages using [AWS SES email templates](https://docs.aws.amazon.com/ses/latest/dg/send-personalized-email-api.html). A SES email template may be created in the console or, better yet, in the resources CloudFormation template for your component.

An example CloudFormation SES email template resource is illustrated below. The `{{variable}}` notations are variables which may be used in the subject or body of the template. Template data will be merged with the template replacing the `{{variable}}` in the template.

_Example: CloudFormation SES Template_

```yaml
Resources:
  MyEmailTemplate:
    Type: AWS::SES::Template
    Properties:
      Template:
        TemplateName: MyEmailTemplate
        SubjectPart: 'How to use SES email templates'
        TextPart: 'This is an AWS SES email template. It has a variable: {{variable}}.'
        HtmlPart: '<p>This is an AWS SES email template. It has a variable:</p><p>{{variable}}</p>'

Outputs:
  MyEmailTemplateName:
    Description: My SES Template Name
    Value: MyEmailTemplate
```

### Sending an email

To send a message, first import the Email service and related types.

```ts
import EmailService, { Email } from '@leanstacks/serverless-common';
```

Next, use the `EmailService.send` function to send an asynchronous request to the Email microservice.

```ts
const queueUrl = config.EMAIL_QUEUE_URL;

const email: Email = {
  destinations: [
    {
      to: ['bob@example.com', 'joe@example.com'],
      cc: ['sally@example.com'],
      bcc: ['james@example.com'],
    },
  ],
  templateName: 'MyEmailTemplate',
  templateData: {
    variable: 'I go in the email template',
  },
};

await EmailService.send(email, queueUrl);
```

That's it! The `EmailService` sends a formatted SQS message to the LeanStacks email microservice.

> **NOTE:** The LeanStacks email microservice sends messages in near real time. There is no delay, batching, or scheduling.
