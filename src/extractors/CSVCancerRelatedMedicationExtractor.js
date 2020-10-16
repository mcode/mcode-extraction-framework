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
      mrn, medicationId, code, codeSystem, displayText, startDate, endDate, treatmentReasonCode, treatmentReasonCodeSystem, treatmentReasonDisplayText, treatmentIntent,
    } = medication;

    if (!(mrn && code && codeSystem && startDate && endDate)) {
      throw new Error('The cancer-related medication is missing an expected element; mrn, code, code system, start date, and end date are all required values.');
    }

    return {
      mrn,
      // Because medicationId is not a required field, we must make it undefined
      // when it isn't read in from the module rather that making it null. If the
      // the value is null, then the bundler function will generate the id element on
      // the resulting fhir resource with a string value of 'null', rather than encoding
      // an actual id as we expect it to.
      id: !medicationId ? undefined : medicationId,
      code,
      codeSystem,
      displayText: !displayText ? null : displayText,
      startDate: formatDateTime(startDate),
      endDate: formatDateTime(endDate),
      treatmentReasonCode: !treatmentReasonCode ? null : treatmentReasonCode,
      treatmentReasonCodeSystem: !treatmentReasonCodeSystem ? null : treatmentReasonCodeSystem,
      treatmentReasonDisplayText: !treatmentReasonDisplayText ? null : treatmentReasonDisplayText,
      treatmentIntent: !treatmentIntent ? null : treatmentIntent,
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
