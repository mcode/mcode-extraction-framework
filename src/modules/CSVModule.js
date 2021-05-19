const fs = require('fs');
const moment = require('moment');
const parse = require('csv-parse/lib/sync');
const logger = require('../helpers/logger');

// The standard string normalizer function
function stringNormalizer(str) {
  return str.toLowerCase();
}

// For translating null/nil-like values into empty strings
function normalizeEmptyValues(data, unalterableColumns = []) {
  const EMPTY_VALUES = ['null', 'nil'].map(stringNormalizer);
  const normalizedUnalterableColumns = unalterableColumns.map(stringNormalizer);
  // Flag tracking if empty values were normalized or not.
  let wasEmptyNormalized = false;
  const newData = data.map((row, i) => {
    const newRow = { ...row };
    // Filter out unalterable columns
    const columnsToNormalize = Object.keys(row).filter((col) => !normalizedUnalterableColumns.includes(stringNormalizer(col)));
    columnsToNormalize.forEach((col) => {
      const value = newRow[col];
      // If the value for this row-col combo is a value that should be empty, replace it
      if (EMPTY_VALUES.includes(stringNormalizer(value))) {
        logger.debug(`NULL/NIL values '${value}' found in row-${i}, col-${col}`);
        wasEmptyNormalized = true;
        newRow[col] = '';
      }
    });
    return newRow;
  });

  if (wasEmptyNormalized) {
    logger.warn('NULL/NIL values found and replaced with empty-strings');
  }
  return newData;
}

class CSVModule {
  constructor(csvFilePath, unalterableColumns) {
    // Parse then normalize the data
    const parsedData = parse(fs.readFileSync(csvFilePath), {
      columns: (header) => header.map((column) => stringNormalizer(column)),
      bom: true,
    });
    this.data = normalizeEmptyValues(parsedData, unalterableColumns);
  }

  async get(key, value, fromDate, toDate) {
    logger.debug(`Get csvModule info by key '${key}'`);
    // return all rows if key and value aren't provided
    if (!key && !value) return this.data;
    let result = this.data.filter((d) => d[stringNormalizer(key)] === value);
    if (result.length === 0) {
      logger.warn(`CSV Record with provided key '${key}' and value was not found`);
      return result;
    }

    // If fromDate and toDate is provided, filter out all results that fall outside that timespan
    if (fromDate && moment(fromDate).isValid()) result = result.filter((r) => !(r.daterecorded && moment(fromDate).isAfter(r.daterecorded)));
    if (toDate && moment(toDate).isValid()) result = result.filter((r) => !(r.daterecorded && moment(toDate).isBefore(r.daterecorded)));
    if (result.length === 0) logger.warn('No data for patient within specified time range');
    return result;
  }
}

module.exports = {
  CSVModule,
};
