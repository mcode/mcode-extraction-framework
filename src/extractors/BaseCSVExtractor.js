const path = require('path');
const { Extractor } = require('./Extractor');
const { CSVModule } = require('../modules');
const { validateCSV } = require('../helpers/csvValidator');
const logger = require('../helpers/logger');

class BaseCSVExtractor extends Extractor {
  constructor({ filePath, csvSchema, unalterableAttributes }) {
    super();
    this.unalterableAttributes = unalterableAttributes || [];
    this.csvSchema = csvSchema;
    this.filePath = path.resolve(filePath);
    this.csvModule = new CSVModule(this.filePath, this.unalterableAttributes);
  }

  validate() {
    if (this.csvSchema) {
      logger.info(`Validating CSV file for ${this.filePath}`);
      return validateCSV(this.filePath, this.csvSchema, this.csvModule.data);
    }
    logger.warn(`No CSV schema provided for ${this.filePath}`);
    return true;
  }
}

module.exports = {
  BaseCSVExtractor,
};
