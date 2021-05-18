const fs = require('fs');
const moment = require('moment');
const parse = require('csv-parse/lib/sync');
const logger = require('../helpers/logger');

function normalizeEmptyValues(data, unalterableAttributes = []) {
  const EMPTY_VALUES = ['null', 'nil'];

  return data.map((row) => {
    const newRow = { ...row };
    // Filter out unalterable attributes
    const attributesToNormalize = Object.keys(row).filter((attr) => !unalterableAttributes.includes(attr));
    attributesToNormalize.forEach((attr) => {
      const value = newRow[attr];
      // If the value for this row-attr combo is a value that should be empty, replace it
      if (EMPTY_VALUES.includes(value.toLowerCase())) {
        newRow[attr] = '';
      }
    });
    return newRow;
  });
}

class CSVModule {
  constructor(csvFilePath, unalterableAttributes) {
    // Parse then normalize the data
    const parsedData = parse(fs.readFileSync(csvFilePath), {
      columns: (header) => header.map((column) => column.toLowerCase()),
      bom: true,
    });
    this.data = normalizeEmptyValues(parsedData, unalterableAttributes);
  }

  async get(key, value, fromDate, toDate) {
    logger.debug(`Get csvModule info by key '${key}'`);
    // return all rows if key and value aren't provided
    if (!key && !value) return this.data;
    let result = this.data.filter((d) => d[key.toLowerCase()] === value);
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
