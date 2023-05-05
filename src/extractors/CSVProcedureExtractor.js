const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const { formatDateTime } = require('../helpers/dateUtils');
const logger = require('../helpers/logger');
const { CSVProcedureSchema } = require('../helpers/schemas/csv');

// Formats data to be passed into template-friendly format
function formatData(procedureData, patientId) {
  logger.debug('Reformatting procedure data from CSV into template format');
  return procedureData.map((data) => {
    const {
      procedureid: procedureId,
      conditionid: conditionId,
      status,
      code,
      codesystem: codeSystem,
      displayname: displayName,
      reasoncode: reasonCode,
      reasoncodesystem: reasonCodeSystem,
      reasondisplayname: reasonDisplayName,
      bodysite: bodySite,
      laterality,
      effectivedate: effectiveDate,
      treatmentintent: treatmentIntent,
    } = data;

    if (!(procedureId && status && code && codeSystem && effectiveDate)) {
      throw new Error('The procedure is missing an expected attribute. Procedure id, code system, code, status and effective date are all required.');
    }
    return {
      id: procedureId,
      subjectId: patientId,
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
  constructor({
    filePath, url, fileName, dataDirectory, csvParse,
  }) {
    super({ filePath, url, fileName, dataDirectory, csvSchema: CSVProcedureSchema, csvParse });
  }

  async getProcedureData(mrn) {
    logger.debug('Getting Procedure Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn, context }) {
    const procedureData = await this.getProcedureData(mrn);
    if (procedureData.length === 0) {
      logger.warn('No procedure data found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // Reformat data
    const formattedData = formatData(procedureData, patientId);

    // Fill templates
    return generateMcodeResources('Procedure', formattedData);
  }
}

module.exports = {
  CSVProcedureExtractor,
};
