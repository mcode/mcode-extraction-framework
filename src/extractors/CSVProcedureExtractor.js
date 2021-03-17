const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const logger = require('../helpers/logger');
const { formatDateTime } = require('../helpers/dateUtils');

// Formats data to be passed into template-friendly format
function formatData(procedureData) {
  logger.debug('Reformatting procedure data from CSV into template format');
  return procedureData.map((data) => {
    const {
      mrn, procedureId, conditionId, status, code, codeSystem, displayName, reasonCode, reasonCodeSystem, reasonDisplayName, bodySite, laterality, effectiveDate, treatmentIntent,
    } = data;

    if (!(mrn && procedureId && status && code && codeSystem && effectiveDate)) {
      throw new Error('The procedure is missing an expected attribute. Procedure id, mrn, code system, code, status and effective date are all required.');
    }
    return {
      id: procedureId,
      subjectId: mrn,
      status,
      code,
      system: codeSystem,
      display: displayName,
      reasonCode,
      reasonCodeSystem,
      reasonDisplayName,
      conditionId,
      bodySite,
      laterality,
      effectiveDateTime: formatDateTime(effectiveDate),
      treatmentIntent,
    };
  });
}

class CSVProcedureExtractor extends BaseCSVExtractor {
  constructor({ filePath }) {
    super({ filePath });
  }

  async getProcedureData(mrn) {
    logger.debug('Getting Procedure Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn }) {
    const procedureData = await this.getProcedureData(mrn);
    const formattedData = formatData(procedureData);

    return generateMcodeResources('Procedure', formattedData);
  }
}

module.exports = {
  CSVProcedureExtractor,
};
