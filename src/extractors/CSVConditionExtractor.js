const path = require('path');
const { CSVModule } = require('../modules');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const { Extractor } = require('./Extractor');
const logger = require('../helpers/logger');

// Formats data to be passed into template-friendly format
function formatData(conditionData) {
  logger.debug('Reformatting condition data from CSV into template format');
  return conditionData.map((data) => {
    const { mrn, conditionId, codeSystem, code } = data;

    return {
      id: conditionId,
      subject: {
        id: mrn,
      },
      code: {
        code,
        system: codeSystem,
      },
    };
  });
}

class CSVConditionExtractor extends Extractor {
  constructor({ filePath }) {
    super();
    this.csvModule = new CSVModule(path.resolve(filePath));
  }

  async getConditionData(mrn) {
    logger.debug('Getting Condition Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn }) {
    const conditionData = await this.getConditionData(mrn);
    const formattedData = formatData(conditionData);

    return generateMcodeResources('Condition', formattedData);
  }
}

module.exports = {
  CSVConditionExtractor,
};
