import * as Joi from 'joi';

import { ServiceError } from '../errors/service.error';

export type LambdaConfig = {
  AWS_REGION: string;
};

export type Config<T = unknown> = T & LambdaConfig;

export class ConfigService {
  private static _config: Config;

  public static init(configSchema: Joi.ObjectSchema): void {
    const { error, value } = configSchema.validate(process.env, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      console.warn(`Configuration is invalid. Detail: ${error}`);
      throw new ServiceError(`Configuration validation failed. ${error.message}`);
    }
    ConfigService._config = value;
  }

  public static getConfig<Config>() {
    return ConfigService._config as Config;
  }
}
