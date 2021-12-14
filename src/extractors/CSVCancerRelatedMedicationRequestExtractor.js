const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const { formatDateTime } = require('../helpers/dateUtils');
const logger = require('../helpers/logger');


function formatData(medicationData, patientId) {
  logger.debug('Reformatting cancer-related medication request data from CSV into template format');

  return medicationData.map((medication) => {
    const {
      requestid: requestId,
      code,
      codesystem: codeSystem,
      displaytext: displayText,
      treatmentreasoncode: treatmentReasonCode,
      treatmentreasoncodesystem: treatmentReasonCodeSystem,
      treatmentreasondisplaytext: treatmentReasonDisplayText,
      procedureintent: procedureIntent,
      status,
      intent,
      authoredon: authoredOn,
      requesterid: requesterId,
    } = medication;

    if (!(code && codeSystem && status && intent && requesterId && authoredOn)) {
      throw new Error('The cancer-related medication request is missing an expected element; code, code system, status, authoredOn, requesterId, and intent are all required values.');
    }

    return {
      ...(requestId && { id: requestId }),
      subjectId: patientId,
      code,
      codeSystem,
      displayText,
      treatmentReasonCode,
      treatmentReasonCodeSystem,
      treatmentReasonDisplayText,
      procedureIntent,
      status,
      intent,
      authoredOn: formatDateTime(authoredOn),
      requesterId,
    };
  });
}

class CSVCancerRelatedMedicationRequestExtractor extends BaseCSVExtractor {
  constructor({ filePath, url, fileName, dataDirectory }) {
    super({ filePath, url, fileName, dataDirectory });
  }

  async getMedicationData(mrn) {
    logger.debug('Getting Cancer Related Medication Request Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn, context }) {
    const medicationData = await this.getMedicationData(mrn);
    if (medicationData.length === 0) {
      logger.warn('No medication request data found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // Reformat data
    const formattedData = formatData(medicationData, patientId);

    // Fill templates
    return generateMcodeResources('CancerRelatedMedicationRequest', formattedData);
  }
}

module.exports = {
  CSVCancerRelatedMedicationRequestExtractor,
};
