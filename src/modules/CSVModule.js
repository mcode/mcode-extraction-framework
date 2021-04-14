const fs = require('fs');
const moment = require('moment');
const parse = require('csv-parse/lib/sync');
const logger = require('../helpers/logger');

class CSVModule {
  constructor(csvFilePath) {
    this.data = parse(fs.readFileSync(csvFilePath), { columns: true, bom: true });
  }

  async get(key, value, fromDate, toDate) {
    logger.debug(`Get csvModule info by key '${key}'`);
    // return all rows if key and value aren't provided
    if (!key && !value) return this.data;
    let result = this.data.filter((d) => d[key] === value);
    if (result.length === 0) throw new ReferenceError(`CSV Record with provided key '${key}' and value was not found`);

    // If fromDate and toDate is provided, filter out all results that fall outside that timespan
    if (fromDate && moment(fromDate).isValid()) result = result.filter((r) => !(r.dateRecorded && moment(fromDate).isAfter(r.dateRecorded)));
    if (toDate && moment(toDate).isValid()) result = result.filter((r) => !(r.dateRecorded && moment(toDate).isBefore(r.dateRecorded)));
    if (result.length === 0) logger.warn('No data for patient within specified time range');
    return result;
  }
}

module.exports = {
  CSVModule,
};
