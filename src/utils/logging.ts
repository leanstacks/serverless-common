import { createLogger, format, LoggerOptions, transports } from 'winston';

import { baseConfigValues as config } from '../services/config.service';

const { combine, json, timestamp } = format;

const loggerOptions: LoggerOptions = {
  format: combine(timestamp(), json()),
  level: config.LOGGING_LEVEL,
  silent: !config.LOGGING_ENABLED,
  transports: [new transports.Console()],
};

const Logger = createLogger(loggerOptions);
Logger.debug('Logger::creating new Logger');

export default Logger;
