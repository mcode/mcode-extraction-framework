const fs = require('fs');
const path = require('path');
const { csvParse } = require('./csvParsingUtils');
const logger = require('./logger');

/**
 * Loads the patientIdCSV data from disk, with some helpful hints logged in case of failure
 *
 * @returns file corresponding to the patient data
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
 * @param {string} patientIdCsvPath filePath to the CSV content to be parsed to get IDs
 * @param {string} dataDirectory optional argument for if a dataDirectory was specified by the config
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
