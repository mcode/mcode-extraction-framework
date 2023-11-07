const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');
const { CSVCancerRelatedMedicationRequestSchema } = require('../helpers/schemas/csv');


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
      dosageroute: dosageRoute,
      asneededcode: asNeededCode,
      doseratetype: doseRateType,
      dosequantityvalue: doseQuantityValue,
      dosequantityunit: doseQuantityUnit,
    } = medication;

    if (!(code && codeSystem && status && intent && requesterId)) {
      throw new Error('The cancer-related medication request is missing an expected element; code, code system, status, requesterId, and intent are all required values.');
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
      authoredOn,
      requesterId,
      dosageRoute,
      asNeededCode,
      doseRateType,
      doseQuantityValue,
      doseQuantityUnit,
    };
  });
}

class CSVCancerRelatedMedicationRequestExtractor extends BaseCSVExtractor {
  constructor({
    filePath, url, fileName, dataDirectory, csvParse,
  }) {
    super({ filePath, url, fileName, dataDirectory, csvSchema: CSVCancerRelatedMedicationRequestSchema, csvParse });
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
