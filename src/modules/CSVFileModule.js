const fs = require('fs');
const moment = require('moment');
const logger = require('../helpers/logger');
const { validateCSV } = require('../helpers/csvValidator');
const { csvParse, stringNormalizer, normalizeEmptyValues, getCSVHeader } = require('../helpers/csvParsingUtils');

class CSVFileModule {
  constructor(csvFilePath, unalterableColumns, parserOptions) {
    // Parse then normalize the data
    const csvData = fs.readFileSync(csvFilePath);
    const parsedData = csvParse(csvData, parserOptions);
    this.filePath = csvFilePath;
    this.data = normalizeEmptyValues(parsedData, unalterableColumns);
    this.header = getCSVHeader(csvData);
  }

  async get(key, value, fromDate, toDate) {
    logger.debug(`Get csvFileModule info by key '${key}'`);
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

  async validate(csvSchema) {
    if (csvSchema) {
      logger.info(`Validating CSV file for ${this.filePath}`);
      return validateCSV(this.filePath, csvSchema, this.data, this.header);
    }
    logger.warn(`No CSV schema provided for ${this.filePath}`);
    return true;
  }
}


module.exports = {
  CSVFileModule,
};
