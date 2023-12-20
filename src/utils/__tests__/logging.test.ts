import { Logger } from '../index';

describe('Logger', () => {
  it('should be defined', () => {
    Logger.debug('I am a DEBUG message.');
    Logger.info('I am an INFO message.');
    Logger.warn('I am a WARN message.');
    Logger.error('I am an ERROR message.');
    Logger.info('Message with data.', { foo: 'bar' });
    Logger.info('', { bar: 'baz' });
    expect(Logger).toBeDefined();
  });
});
