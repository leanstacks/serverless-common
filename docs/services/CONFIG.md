:house: [Home](/README.md) | :books: [Docs](../DOCS.md)

# Configuration

This document describes how to configure a serverless application component leveraging
shared components from the `serverless-common` package.

## How it works

AWS provides configuration to Lambda functions through the `process.env` object, similar to
any Node.js application. The `serverless-common` package provides the means for serverless
components to validate and access a typed configuration object.

AWS supplies a default set of attributes to every Lambda function, e.g. `AWS_REGION`, and
you may define additional custom attributes for your functions.

## Using `LambdaConfig`, the default configuration

When a serverless component does not declare any additional environment variables, but
needs access to the base configuration supplied to all Lambda functions, the
`serverless-common` package provides the `lambdaConfigValues` object of type `LambdaConfig`.
The example below illustrates how to use `lambdaConfigValues`.

Simply import `lambdaConfigValues` into any module which requires access to the configuration.
This ready to use object is of type [`LambdaConfig`](/src/services/config.service.ts).

```ts
// some-component.ts
import { lambdaConfigValues as config } from '@leanstacks/serverless-common';

console.log(`The region is ${config.AWS_REGON}`);
```

## Extending `LambdaConfig` with custom configuration attributes

When a Lambda function has custom configuration attributes, simply extend the `LambdaConfig` type
and [Joi](https://joi.dev/) validation schema. The example below illustrates how to extend `LambdaConfig`.

Create a configuration module in your serverless project. Import the `LambdaConfig` type, the
`lambdaConfigSchema` Joi schema for that type, and the `validateConfig` utility function.

```ts
// my-config.ts
import { LambdaConfig, lambdaConfigSchema, validateConfig } from '@leanstacks/serverless-common';

// extend LambdaConfig
type MyConfig = LambdaConfig & {
  TABLE_NAME: string;
  QUEUE_NAME: string;
  EXPIRES_IN_DAYS: number;
};

// extend lambdaConfigSchema
const myConfigSchema = lambdaConfigSchema.keys({
  TABLE_NAME: Joi.string().required(),
  QUEUE_NAME: Joi.string().required(),
  EXPIRES_IN_DAYS: Joi.number().default(30),
});

// validate and process custom configuration
const config: MyConfig = validateConfig<MyConfig>(myConfigSchema);
export default config;
```

Now the exported `config` object of type `MyConfig` may be used in any other module within the
serverless component. For example...

```ts
// some-component.ts
import config from 'my-config';

console.log(`The table name is ${config.TABLE_NAME}`);
```

## Performance considerations

The configuration attributes are validated by Joi. To ensure that performance is not negatively
impacted, this validation occurs just once, when the configuration module
is first loaded by the module loader. When modules subsequently import the configuration
object, the pre-processed object is loaded without executing the validation process again.
