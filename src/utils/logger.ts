import winston, { LoggerOptions } from 'winston';

import { baseConfigValues as config } from '../services';

const loggerOptions: LoggerOptions = {
  level: config.LOG_LEVEL,
  transports: [new winston.transports.Console()],
};

const _logger = winston.createLogger(loggerOptions);
_logger.info('test message');

const Logger = {
  debug: _logger.debug,
  info: _logger.info,
  warn: _logger.warn,
  error: _logger.error,
};

export default Logger;
