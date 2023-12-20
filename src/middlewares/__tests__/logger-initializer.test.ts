import { loggerInitializer } from '../logger-initializer';

import Logger from '../../utils/logger';
import { requestFixture } from '../../__fixtures__/middy.fixture';

describe('loggerInitializer', () => {
  it('should create the middleware', () => {
    const middleware = loggerInitializer();

    expect(middleware.before).toBeDefined();
  });

  it('should set defaultMeta', () => {
    const middleware = loggerInitializer();

    // expect Logger to not have defaultMeta before middleware runs
    expect(Logger.defaultMeta).toBeNull();

    // run the middleware
    middleware.before?.(requestFixture);

    // expect Logger to have defaultMeta initialized
    expect(Logger.defaultMeta).toEqual({ requestId: 'awsRequestId' });
  });
});
