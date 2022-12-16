const axios = require('axios');
const moment = require('moment');
const logger = require('../helpers/logger');
const { validateCSV } = require('../helpers/csvValidator');
const { csvParse, stringNormalizer, normalizeEmptyValues, getCSVHeader } = require('../helpers/csvParsingUtils');

class CSVURLModule {
  constructor(url, unalterableColumns, parserOptions) {
    this.unalterableColumns = unalterableColumns;
    this.url = url;
    this.data = undefined;
    this.parserOptions = parserOptions;
  }

  // Ensures that this.data contains normalized CSV data fetched from the module's url
  // If data is already cached, this function does nothing
  async fillDataCache() {
    if (!this.data) {
      logger.debug('Filling the data cache of CSVURLModule');
      const csvData = await axios.get(this.url)
        .then((res) => res.data)
        .catch((e) => {
          logger.error('Error occurred when making a connection to this url');
          throw e;
        });
      logger.debug('Web request successful');
      // Parse then normalize the data
      const parsedData = csvParse(csvData, this.parserOptions);
      logger.debug('CSV Data parsing successful');
      this.data = normalizeEmptyValues(parsedData, this.unalterableColumns);
      this.header = getCSVHeader(csvData);
    }
  }

  async get(key, value, fromDate, toDate) {
    await this.fillDataCache();

    logger.debug(`Get csvURLModule info by key '${key}'`);
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
    await this.fillDataCache();

    if (csvSchema) {
      this.data = normalizeEmptyValues(this.data, this.unalterableColumns);
      return validateCSV(this.url, csvSchema, this.data, this.header);
    }
    logger.warn(`No CSV schema provided for data found at ${this.url}`);
    return true;
  }
}

module.exports = {
  CSVURLModule,
};
