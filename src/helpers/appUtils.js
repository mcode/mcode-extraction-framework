const fs = require('fs');
const path = require('path');
const { csvParse } = require('./csvParsingUtils');
const logger = require('./logger');

/**
 * Parses a provided CSV with MRN column into string array of IDs
 *
 * @param {string} pathToCSV filePath to the CSV content to be parsed to get IDs
 * @returns array of parsed IDs from the CSV
 */
function parsePatientIds(pathToCSV) {
  // Parse CSV for list of patient IDs
  const patientIdsCsvPath = path.resolve(pathToCSV);
  const patientIds = csvParse(fs.readFileSync(patientIdsCsvPath, 'utf8')).map((row) => {
    if (!row.mrn) {
      throw new Error(`${pathToCSV} has no "mrn" column`);
    }

    return row.mrn;
  });

  return patientIds;
}

function buildPatientCSVPath(config) {
  try {
    const patientIdCsvPath = path.resolve(config.patientIdCsvPath);
    return patientIdCsvPath;
  } catch (e) {
    if (config.commonExtractorArgs.dataDirectory) {
      logger.error(`Could not resolve ${config.patientIdCsvPath}; even with a dataDirectory, the config.patientIdCsvPath variable needs to be a resolvable path to the patientID file on disk.`);
    }
    throw e;
  }
}

module.exports = {
  buildPatientCSVPath,
  parsePatientIds,
};
