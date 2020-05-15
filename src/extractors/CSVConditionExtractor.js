const { CSVModule } = require('../modules');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const { Extractor } = require('./Extractor');
const logger = require('../helpers/logger');

// Formats data to be passed into template-friendly format
function formatData(conditionData) {
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
  constructor(conditionCSVPath) {
    super();
    this.csvModule = new CSVModule(conditionCSVPath);
  }

  async getConditionData(mrn) {
    logger.info('Getting Condition Data');
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
