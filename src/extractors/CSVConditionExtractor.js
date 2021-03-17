const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const logger = require('../helpers/logger');
const { formatDateTime } = require('../helpers/dateUtils');
const { CSVConditionSchema } = require('../helpers/schemas/csv');

// Formats data to be passed into template-friendly format
function formatData(conditionData) {
  logger.debug('Reformatting condition data from CSV into template format');
  return conditionData.map((data) => {
    const {
      mrn, conditionId, codeSystem, code, displayName, category, dateOfDiagnosis, clinicalStatus, verificationStatus, bodySite, laterality, histology,
    } = data;

    if (!(conditionId && mrn && codeSystem && code && category)) {
      throw new Error('The condition is missing an expected attribute. Condition id, mrn, code system, code, and category are all required.');
    }
    return {
      id: conditionId,
      subject: {
        id: mrn,
      },
      code: {
        code,
        system: codeSystem,
        display: displayName,
      },
      category: category.split('|'),
      dateOfDiagnosis: !dateOfDiagnosis ? null : formatDateTime(dateOfDiagnosis),
      clinicalStatus,
      verificationStatus,
      bodySite: !bodySite ? null : bodySite.split('|'),
      laterality,
      histology,
    };
  });
}

class CSVConditionExtractor extends BaseCSVExtractor {
  constructor({ filePath }) {
    super({ filePath, csvSchema: CSVConditionSchema });
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
