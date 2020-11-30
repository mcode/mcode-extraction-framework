const path = require('path');
const { CSVModule } = require('../modules');
const { generateMcodeResources } = require('../templates');
const { Extractor } = require('./Extractor');
const logger = require('../helpers/logger');
const { formatDateTime } = require('../helpers/dateUtils');


function formatData(medicationData) {
  logger.debug('Reformatting cancer-related medication data from CSV into template format');

  return medicationData.map((medication) => {
    const {
      mrn, medicationId, code, codeSystem, displayText, startDate, endDate, treatmentReasonCode, treatmentReasonCodeSystem, treatmentReasonDisplayText, treatmentIntent, status,
    } = medication;

    if (!(mrn && code && codeSystem && status)) {
      throw new Error('The cancer-related medication is missing an expected element; mrn, code, code system, and status are all required values.');
    }

    return {
      mrn,
      ...(medicationId && { id: medicationId }),
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

class CSVCancerRelatedMedicationExtractor extends Extractor {
  constructor({ filePath }) {
    super();
    this.csvModule = new CSVModule(path.resolve(filePath));
  }

  async getMedicationData(mrn) {
    logger.debug('Getting Cancer Related Medication Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn }) {
    const medicationData = await this.getMedicationData(mrn);
    const formattedData = formatData(medicationData);

    return generateMcodeResources('CancerRelatedMedication', formattedData);
  }
}

module.exports = {
  CSVCancerRelatedMedicationExtractor,
};
