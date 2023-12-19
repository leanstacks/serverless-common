import Logger from '../logger';

describe('logger', () => {
  it('should write log to console', () => {
    Logger.info('I am a unit test');
  });
});
