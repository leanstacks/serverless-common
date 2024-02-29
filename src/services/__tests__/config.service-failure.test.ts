import { jest } from '@jest/globals';

import { ServiceError } from '../../errors/service.error';
import ConfigService, { BaseConfig, baseConfigSchema } from '../config.service';

describe('ConfigService Failure', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.AWS_REGION;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should throw error when validation fails', () => {
    expect(() => ConfigService.validateConfig<BaseConfig>(baseConfigSchema)).toThrow(ServiceError);
  });
});
