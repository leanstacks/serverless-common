jest.mock('winston', () => {
  createLogger: jest.fn().mockReturnValue({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  });
});

import winston from 'winston';

import Logger from '../logger';

describe('logger', () => {
  it('should write log to console', () => {
    const loggerSpy = jest.spyOn(winston, 'info');

    Logger.info('I am a unit test');

    expect(loggerSpy).toHaveBeenCalled();
  });
});
