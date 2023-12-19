import { createLogger, format, LoggerOptions, transports } from 'winston';

import { baseConfigValues as config } from '../services';

const { printf } = format;

const messageFormat = printf(({ level, message }) => {
  return `${level}::${message}`;
});

const loggerOptions: LoggerOptions = {
  format: messageFormat,
  level: config.LOG_LEVEL,
  transports: [new transports.Console()],
};

const _logger = createLogger(loggerOptions);
_logger.debug('Logger::creating new Logger');

export default _logger;
