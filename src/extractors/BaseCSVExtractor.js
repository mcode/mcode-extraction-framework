const path = require('path');
const { Extractor } = require('./Extractor');
const { CSVModule } = require('../modules');
const { validateCSV } = require('../helpers/csvValidator');
const logger = require('../helpers/logger');

class BaseCSVExtractor extends Extractor {
  constructor({ filePath, csvSchema }) {
    super();
    this.csvSchema = csvSchema;
    this.filePath = path.resolve(filePath);
    this.csvModule = new CSVModule(this.filePath);
  }

  async validate() {
    if (this.csvSchema) {
      logger.info(`Validating CSV file for ${this.filePath}`);
      await validateCSV(this.filePath, this.csvSchema);
    } else {
      logger.warn(`No CSV schema provided for ${this.filePath}`);
    }
  }
}

module.exports = {
  BaseCSVExtractor,
};
