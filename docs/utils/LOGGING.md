:house: [Home](/README.md) | :books: [Docs](../DOCS.md)

# Logging

This document describes the `Logger` component from the `serverless-common` package.

## How it works

The `Logger` component is the preferred way to write logs from serverless applications. It uses the popular [winston](https://www.npmjs.com/package/winston) logger package to write messages from your serverless functions. These messages are automatically captured in AWS CloudWatch logs.

## Using the `Logger`

To use the logger in any component, first import it.

```ts
import { Logger } from '@leanstacks/serverless-common';
```

The `Logger` is the actual `winston` Logger that has been configured with some sensible defaults. To use the `Logger` in your code do something like this...

```ts
Logger.info('my message');
```

That will emit a log message which looks like this...

```json
{
  "level": "info",
  "message": "my message",
  "requestId": "AWS Lambda Request Identifier",
  "timestamp": "2023-12-19T115:20:25.608Z"
}
```

Logs are written as JSON because it is easier to [query and filter AWS CloudWatch Logs which use JSON](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html#matching-terms-json-log-events). You may also establish CloudWatch metrics and alarms from CloudWatch Logs filters.

### Including `data` in messages

Often log messages contain data whether that is a simple primitive value or an object. Data should be logged in a standard and predictable way to facilitate log filtering and querying. Building upon the example above, we can log data like this...

```ts
cont tasks = await TaskService.list();
Logger.info('my message', { data: { tasks } });
```

That will emit a log message which looks like this...

```json
{
  "data": {
    "tasks": []
  },
  "level": "info",
  "message": "my message",
  "requestId": "AWS Lambda Request Identifier",
  "timestamp": "2023-12-19T115:20:25.608Z"
}
```

### Including an `error` in messages

You may include Errors in log messages. Like with `data`, we should include the Error in a standardized way...

```ts
const error = new Error('System Error');
Logger.info('my messsage', error);
```

That will emit a log message which looks like this...

```json
{
  "data": {
    "tasks": []
  },
  "level": "info",
  "message": "my message System Error",
  "requestId": "AWS Lambda Request Identifier",
  "stack": "full stack trace from error",
  "timestamp": "2023-12-19T115:20:25.608Z"
}
```

## Configuring the `Logger`

The default configuration of the `Logger` is:

- Logging is enabled
- Level `info`, meaning info, warn, and error logging statments are written, but not debug
- Log messages are written as JSON for improved filtering and querying

### Configuration Options

| Key               | Description                                                           | Default |
| ----------------- | --------------------------------------------------------------------- | ------- |
| `LOGGING_ENABLED` | Enable or disable logging altogether.                                 | `true`  |
| `LOGGING_LEVEL`   | The lowest logging level. One of `debug`, `info`, `warn`, or `error`. | `info`  |

To modify the default configuration, for example to write `debug` messages to the log, simply overwrite the configuration in your serverless component environment variables such as:

_Example serverless.yml file_

```yml
params:
  default:
    loggingLevel: info
  dev:
    loggingLevel: debug

provider:
  environment:
    LOGGING_LEVEL: ${param:loggingLevel}
```
