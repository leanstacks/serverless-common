import { Logger } from '../index';

/**
 * Note: These tests are really just to illustrate how to use the `Logger`.
 * The Logger itself is a `winston` logger instance. The `winston` package
 * performs it's own testing so we do not need to test it ourselves.
 */
describe('Logger', () => {
  it('should be defined', () => {
    Logger.debug('I am a DEBUG message.');
    Logger.info('I am an INFO message.');
    Logger.warn('I am a WARN message.');
    Logger.error('I am an ERROR message.');

    expect(Logger).toBeDefined();
  });

  it('should include data', () => {
    const foo = {
      bar: 'baz',
    };
    Logger.info('Message with data.', { data: { foo } });

    expect(Logger).toBeDefined();
  });

  it('should include error', () => {
    const error = new Error('Something is wrong.');
    Logger.info('Message with an error.', error);

    expect(Logger).toBeDefined();
  });
});
