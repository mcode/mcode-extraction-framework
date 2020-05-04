const { loggers, format, transports } = require('winston');

const LOGGER_NAME = 'cli';
const logFormat = format.printf(({ level, message, timestamp }) => (`${timestamp} [${level}]: ${message}`));

if (!loggers.has(LOGGER_NAME)) {
  loggers.add(LOGGER_NAME, {
    level: process.env.LOGGING || 'info',
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'HH:mm:ss.SS' }),
      format.align(),
      logFormat,
    ),
    transports: [
      new transports.Console({
        silent: process.env.LOGGING === 'none',
      }),
    ],
  });
}

module.exports = loggers.get(LOGGER_NAME);
