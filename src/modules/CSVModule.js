const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const logger = require('../helpers/logger');

class CSVModule {
  constructor(csvFilePath) {
    this.data = parse(fs.readFileSync(csvFilePath), { columns: true });
  }

  async get(key, value) {
    logger.info(`Get csvModule info by key '${key}'`);
    // return all rows if key and value aren't provided
    if (!key && !value) return this.data;
    const result = this.data.filter((d) => d[key] === value);
    if (result.length === 0) throw new ReferenceError(`CSV Record with provided key '${key}' and value was not found`);
    return result;
  }
}

module.exports = {
  CSVModule,
};
