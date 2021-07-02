const { Extractor } = require('./Extractor');
const { CSVFileModule, CSVURLModule } = require('../modules');

class BaseCSVExtractor extends Extractor {
  constructor({ filePath, url, csvSchema, unalterableColumns }) {
    super();
    if (url) {
      this.unalterableColumns = unalterableColumns || [];
      this.csvSchema = csvSchema;
      this.url = url;
      this.csvModule = new CSVURLModule(this.url, this.unalterableColumns);
    } else if (filePath) {
      this.filePath = filePath;
      this.csvModule = new CSVFileModule(this.filePath, this.unalterableColumns);
    } else {
      throw new Error('Trying to instantiate a CSVExtractor without a filePath or url');
    }
  }

  async validate() {
    return this.csvModule.validate(this.csvSchema);
  }
}

module.exports = {
  BaseCSVExtractor,
};
