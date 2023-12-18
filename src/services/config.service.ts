import * as Joi from 'joi';

import { ServiceError } from '../errors/service.error';

/**
 * The `BaseConfig` type describes the configuration values supplied to every AWS Lambda
 * function by default. Extend `BaseConfig` with your own service-specific configuration
 * type.
 *
 * Example:
 * ```
 * type ServiceConfig = BaseConfig & {
 *   FOO: string;
 *   BAR: number;
 * }
 * ```
 */
export type BaseConfig = {
  AWS_EXECUTION_ENV: string;
  AWS_LAMBDA_FUNCTION_NAME: string;
  AWS_LAMBDA_FUNCTION_MEMORY_SIZE: string;
  AWS_LAMBDA_FUNCTION_VERSION: string;
  AWS_REGION: string;
  LOG_LEVEL: string;
};

/**
 * Validates the configuration with the supplied Joi ObjectSchema. Uses `process.env` as the
 * configuration source.
 * @param schema - A `Joi.ObjectSchema` of type `TConfig` to validate the configuration values.
 * @returns An Object of type `TConfig` containing the validated configuration if successful,
 * otherwise throws a `ServiceError`.
 * @throws Throws a `ServiceError` when validation is unsuccessful.
 */
function validateConfig<TConfig>(schema: Joi.ObjectSchema<TConfig>): TConfig {
  const { error, value } = schema.validate(process.env, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (error) {
    console.warn(`Configuration is invalid. Detail: ${error}`);
    throw new ServiceError(`Configuration validation failed. ${error.message}`);
  }
  return value as TConfig;
}

/**
 * A Joi ObjectSchema to validate the base AWS Lambda function configuration values.
 */
export const baseConfigSchema = Joi.object({
  AWS_EXECUTION_ENV: Joi.string().required(),
  AWS_LAMBDA_FUNCTION_NAME: Joi.string().required(),
  AWS_LAMBDA_FUNCTION_MEMORY_SIZE: Joi.string().required(),
  AWS_LAMBDA_FUNCTION_VERSION: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  LOG_LEVEL: Joi.string().default('info'),
});

/**
 * A `BaseConfig` object containing the base AWS Lambda function configuration values.
 * This is useful when your function does not have additional configuration attributes.
 * @see {@link BaseConfig}
 */
export const baseConfigValues = validateConfig<BaseConfig>(baseConfigSchema);

const ConfigService = {
  validateConfig,
};

export default ConfigService;
