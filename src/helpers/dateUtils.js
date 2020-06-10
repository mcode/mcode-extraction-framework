const moment = require('moment');
const logger = require('./logger');

moment.suppressDeprecationWarnings = true; // We handle invalid date formats
const dateFormat = 'YYYY-MM-DD';
const dateTimeFormat = 'YYYY-MM-DDThh:mm:ssZ';

function formatDate(date) {
  const parsedDate = moment(date);
  if (!parsedDate.isValid()) {
    logger.warn(`Invalid date provided: ${date}. Provided value will be used.`);
    return date; // Use the provided date rather than 'Invalid date'
  }

  return parsedDate.format(dateFormat);
}

function formatDateTime(date) {
  const parsedDate = moment(date);
  if (!parsedDate.isValid()) {
    logger.warn(`Invalid date provided: ${date}. Provided value will be used.`);
    return date; // Use the provided date rather than 'Invalid date'
  }

  if (parsedDate.hour()) {
    return parsedDate.format(dateTimeFormat);
  }
  return parsedDate.format(dateFormat);
}

module.exports = {
  formatDate,
  formatDateTime,
};
