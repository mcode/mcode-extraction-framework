const _ = require('lodash');
const logger = require('./logger');

// Validates csvData against the csvSchema
// Uses the csvFileIdentifier in logs for readability
function validateCSV(csvFileIdentifier, csvSchema, csvData) {
  let isValid = true;

  // Check headers
  const headers = Object.keys(csvData[0]).map((h) => h.toLowerCase());
  const schemaDiff = _.difference(csvSchema.headers.map((h) => h.name.toLowerCase()), headers);
  const fileDiff = _.difference(headers, csvSchema.headers.map((h) => h.name.toLowerCase()));

  if (fileDiff.length > 0) {
    logger.warn(`Found extra column(s) in CSV ${csvFileIdentifier}: "${fileDiff.join(',')}"`);
  }

  if (schemaDiff.length > 0) {
    schemaDiff.forEach((sd) => {
      const headerSchema = csvSchema.headers.find((h) => h.name.toLowerCase() === sd);
      if (headerSchema.required) {
        logger.error(`Column ${sd} is marked as required but is missing in CSV ${csvFileIdentifier}`);
        isValid = false;
      } else {
        logger.warn(`Column ${sd} is missing in CSV ${csvFileIdentifier}`);
      }
    });
  }

  // Check values
  csvData.forEach((row, i) => {
    Object.entries(row).forEach(([key, value], j) => {
      const schema = csvSchema.headers.find((h) => h.name === key);

      if (schema && schema.required && !value) {
        logger.error(`Column ${key} marked as required but missing value in row ${i + 1} column ${j + 1} in CSV ${csvFileIdentifier}`);
        isValid = false;
      }
    });
  });

  return isValid;
}

module.exports = {
  validateCSV,
};
