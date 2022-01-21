const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const { formatDateTime } = require('../helpers/dateUtils');
const logger = require('../helpers/logger');


function formatData(medicationData, patientId) {
  logger.debug('Reformatting cancer-related medication administration data from CSV into template format');

  return medicationData.map((medication) => {
    const {
      medicationid: medicationId,
      code,
      codesystem: codeSystem,
      displaytext: displayText,
      startdate: startDate,
      enddate: endDate,
      treatmentreasoncode: treatmentReasonCode,
      treatmentreasoncodesystem: treatmentReasonCodeSystem,
      treatmentreasondisplaytext: treatmentReasonDisplayText,
      treatmentintent: treatmentIntent,
      status,
    } = medication;

    if (!(code && codeSystem && status)) {
      throw new Error('The cancer-related medication administration is missing an expected element; code, code system, and status are all required values.');
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

class CSVCancerRelatedMedicationAdministrationExtractor extends BaseCSVExtractor {
  constructor({
    filePath, url, fileName, dataDirectory, csvParse,
  }) {
    super({ filePath, url, fileName, dataDirectory, csvParse });
  }

  async getMedicationData(mrn) {
    logger.debug('Getting Cancer Related Medication Administration Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn, context }) {
    const medicationData = await this.getMedicationData(mrn);
    if (medicationData.length === 0) {
      logger.warn('No medication administration data found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // Reformat data
    const formattedData = formatData(medicationData, patientId);

    // Fill templates
    return generateMcodeResources('CancerRelatedMedicationAdministration', formattedData);
  }
}

module.exports = {
  CSVCancerRelatedMedicationAdministrationExtractor,
};
