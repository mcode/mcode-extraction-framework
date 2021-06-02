const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');

/**
 * Parses a provided CSV with MRN column into string array of IDs
 *
 * @param {string} pathToCSV filePath to the CSV content to be parsed to get IDs
 * @returns array of parsed IDs from the CSV
 */
function parsePatientIds(pathToCSV) {
  // Parse CSV for list of patient IDs
  const patientIdsCsvPath = path.resolve(pathToCSV);
  const patientIds = parse(fs.readFileSync(patientIdsCsvPath, 'utf8'), {
    columns: (header) => header.map((column) => column.toLowerCase()),
    bom: true,
  }).map((row) => {
    if (!row.mrn) {
      throw new Error(`${pathToCSV} has no "mrn" column`);
    }

    return row.mrn;
  });

  return patientIds;
}

module.exports = {
  parsePatientIds,
};
