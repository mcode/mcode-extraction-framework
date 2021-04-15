const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const { formatDateTime } = require('../helpers/dateUtils');
const logger = require('../helpers/logger');


function formatData(medicationData, patientId) {
  logger.debug('Reformatting cancer-related medication data from CSV into template format');

  return medicationData.map((medication) => {
    const {
      medicationId, code, codeSystem, displayText, startDate, endDate, treatmentReasonCode, treatmentReasonCodeSystem, treatmentReasonDisplayText, treatmentIntent, status,
    } = medication;

    if (!(code && codeSystem && status)) {
      throw new Error('The cancer-related medication is missing an expected element; mrn, code, code system, and status are all required values.');
    }

    return {
      ...(medicationId && { id: medicationId }),
      subjectId: patientId,
      code,
      codeSystem,
      displayText,
      startDate: !startDate ? null : formatDateTime(startDate),
      endDate: !endDate ? null : formatDateTime(endDate),
      treatmentReasonCode,
      treatmentReasonCodeSystem,
      treatmentReasonDisplayText,
      treatmentIntent,
      status,
    };
  });
}

class CSVCancerRelatedMedicationExtractor extends BaseCSVExtractor {
  constructor({ filePath }) {
    super({ filePath });
  }

  async getMedicationData(mrn) {
    logger.debug('Getting Cancer Related Medication Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn, context }) {
    const medicationData = await this.getMedicationData(mrn);
    if (medicationData.length === 0) {
      logger.warn('No medication data found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // Reformat data
    const formattedData = formatData(medicationData, patientId);

    // Fill templates
    return generateMcodeResources('CancerRelatedMedication', formattedData);
  }
}

module.exports = {
  CSVCancerRelatedMedicationExtractor,
};
