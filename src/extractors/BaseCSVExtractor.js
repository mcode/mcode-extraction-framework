const path = require('path');
const { Extractor } = require('./Extractor');
const { CSVFileModule, CSVURLModule } = require('../modules');
const logger = require('../helpers/logger');


class BaseCSVExtractor extends Extractor {
  constructor({
    filePath, url, fileName, dataDirectory, csvSchema, unalterableColumns, csvParse
  }) {
    super();
    this.unalterableColumns = unalterableColumns || [];
    this.csvSchema = csvSchema;
    this.parserOptions = csvParse && csvParse.options ? csvParse.options : {};
    if (url) {
      logger.debug('Found url argument; creating a CSVURLModule with the provided url');
      this.url = url;
      this.csvModule = new CSVURLModule(this.url, this.unalterableColumns, this.parserOptions);
    } else if (fileName && dataDirectory) {
      if (!path.isAbsolute(dataDirectory)) throw new Error('dataDirectory is not an absolutePath, it needs to be.');
      this.filePath = path.join(dataDirectory, fileName);
      logger.debug(
        'Found fileName and dataDirectory arguments; creating a CSVFileModule with the provided dataDirectory and fileName',
      );
      this.csvModule = new CSVFileModule(this.filePath, this.unalterableColumns, this.parserOptions);
    } else if (filePath) {
      logger.debug('Found filePath argument; creating a CSVFileModule with the provided filePath');
      this.filePath = filePath;
      this.csvModule = new CSVFileModule(this.filePath, this.unalterableColumns, this.parserOptions);
    } else {
      logger.debug(
        'Could not instantiate a CSVExtractor with the provided constructor args',
      );
      throw new Error('Trying to instantiate a CSVExtractor without a valid filePath, url, or fileName+dataDirectory combination');
    }
  }

  async validate() {
    return this.csvModule.validate(this.csvSchema);
  }
}

module.exports = {
  BaseCSVExtractor,
};
