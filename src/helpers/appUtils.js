const fs = require('fs');
const path = require('path');
const { csvParse } = require('./csvParsingUtils');
const logger = require('./logger');

/**
 * Loads the patientIdCSV data from disk, with some helpful hints logged in case of failure
 *
 * @returns array of parsed IDs from the CSV
 */
function getPatientIdCSVData(patientIdCsvPath, dataDirectory) {
  try {
    const patientIdsCsvPath = path.resolve(patientIdCsvPath);
    return fs.readFileSync(patientIdsCsvPath, 'utf8');
  } catch (e) {
    if (dataDirectory) {
      logger.error(`Could not resolve ${patientIdCsvPath}; even with a dataDirectory, the config.patientIdCsvPath variable needs to be a resolvable path to the patientID file on disk.`);
    }
    throw e;
  }
}

/**
 * Parses a provided CSV with MRN column into string array of IDs
 *
 * @returns array of parsed IDs from the CSV
 */
function parsePatientIds(patientIdCsvPath, dataDirectory) {
  const csvData = getPatientIdCSVData(patientIdCsvPath, dataDirectory);
  return csvParse(csvData).map((row) => {
    if (!row.mrn) {
      throw new Error(`${patientIdCsvPath} has no "mrn" column`);
    }
    return row.mrn;
  });
}

module.exports = {
  parsePatientIds,
};
