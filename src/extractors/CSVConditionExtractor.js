const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const { formatDateTime } = require('../helpers/dateUtils');
const { CSVConditionSchema } = require('../helpers/schemas/csv');
const logger = require('../helpers/logger');

// Formats data to be passed into template-friendly format
function formatData(conditionData, patientId) {
  logger.debug('Reformatting condition data from CSV into template format');
  return conditionData.map((data) => {
    const {
      conditionid: conditionId,
      codesystem: codeSystem,
      code,
      displayname: displayName,
      category,
      dateofdiagnosis: dateOfDiagnosis,
      clinicalstatus: clinicalStatus,
      verificationstatus: verificationStatus,
      bodysite: bodySite,
      laterality,
      histology,
    } = data;

    if (!(conditionId && codeSystem && code && category)) {
      throw new Error('The condition is missing an expected attribute. Condition id, code system, code, and category are all required.');
    }
    return {
      id: conditionId,
      subject: {
        id: patientId,
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
  constructor({ filePath, url, fileName, dataDirectory, csvParse }) {
    super({ filePath, url, fileName, dataDirectory, csvSchema: CSVConditionSchema, csvParse });
  }

  async getConditionData(mrn) {
    logger.debug('Getting Condition Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn, context }) {
    const conditionData = await this.getConditionData(mrn);
    if (conditionData.length === 0) {
      logger.warn('No condition data found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // Reformat data
    const formattedData = formatData(conditionData, patientId);

    // Fill templates
    return generateMcodeResources('Condition', formattedData);
  }
}

module.exports = {
  CSVConditionExtractor,
};
