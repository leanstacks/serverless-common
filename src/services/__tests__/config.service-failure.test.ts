import { ServiceError } from '../../errors/service.error';
import { LambdaConfig, lambdaConfigSchema, validateConfig } from '../config.service';

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
    expect(() => validateConfig<LambdaConfig>(lambdaConfigSchema)).toThrow(ServiceError);
  });
});
