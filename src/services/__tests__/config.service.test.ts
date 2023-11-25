import { LambdaConfig, lambdaConfigSchema, validateConfig } from '../config.service';

describe('ConfigService', () => {
  it('should validate successfully', () => {
    const validatedConfig = validateConfig<LambdaConfig>(lambdaConfigSchema);

    expect(validatedConfig).toBeDefined();
  });

  it('should return LambdaConfig attributes', () => {
    const validatedConfig = validateConfig<LambdaConfig>(lambdaConfigSchema);

    expect(validatedConfig).toBeDefined();
    expect(validatedConfig.AWS_EXECUTION_ENV).toBe('aws-execution-env');
    expect(validatedConfig.AWS_LAMBDA_FUNCTION_MEMORY_SIZE).toBe('128');
    expect(validatedConfig.AWS_LAMBDA_FUNCTION_NAME).toBe('aws-lambda-function-name');
    expect(validatedConfig.AWS_LAMBDA_FUNCTION_VERSION).toBe('aws-lambda-function-version');
    expect(validatedConfig.AWS_REGION).toBe('aws-region');
  });
});
