const moment = require('moment');
const logger = require('./logger');

moment.suppressDeprecationWarnings = true; // We handle invalid date formats
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ssZ';

function formatDate(date) {
  const parsedDate = moment.utc(date);
  if (!parsedDate.isValid()) {
    logger.warn(`Invalid date provided: ${date}. Provided value will be used.`);
    return date; // Use the provided date rather than 'Invalid date'
  }

  return parsedDate.format(dateFormat);
}

function formatDateTime(date) {
  const parsedDate = moment.utc(date);
  if (!parsedDate.isValid()) {
    logger.warn(`Invalid date provided: ${date}. Provided value will be used.`);
    return date; // Use the provided date rather than 'Invalid date'
  }

  // HACKY: If there is a minute, second, or hour, then we should treat this as a datetimestamp
  if (parsedDate.hour() || parsedDate.minute() || parsedDate.second()) {
    return parsedDate.format(dateTimeFormat);
  }
  return parsedDate.format(dateFormat);
}

module.exports = {
  formatDate,
  formatDateTime,
  dateFormat,
  dateTimeFormat,
};
