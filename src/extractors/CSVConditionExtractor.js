const path = require('path');
const { CSVModule } = require('../modules');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const { Extractor } = require('./Extractor');
const logger = require('../helpers/logger');
const { formatDateTime } = require('../helpers/dateUtils');

// Formats data to be passed into template-friendly format
function formatData(conditionData) {
  logger.debug('Reformatting condition data from CSV into template format');
  const {
    mrn, conditionId, codeSystem, code, displayName, category, dateOfDiagnosis, clinicalStatus, verificationStatus, bodySite, laterality, histology,
  } = conditionData;

  if (!(conditionId && mrn && codeSystem && code && category)) {
    throw new Error('The condition is missing an expected attribute. Condition id, mrn, code system, code, and category are all required.');
  }

  return {
    conditionId,
    mrn,
    code: {
      code,
      system: codeSystem,
      display: displayName,
    },
    category: category.split('|').map((categoryCode) => ({
      system: 'http://terminology.hl7.org/CodeSystem/condition-category',
      code: categoryCode,
    })),
    dateOfDiagnosis: !dateOfDiagnosis ? null : {
      value: formatDateTime(dateOfDiagnosis),
      url: 'http://hl7.org/fhir/StructureDefinition/condition-assertedDate',
    },
    clinicalStatus: !clinicalStatus ? null : {
      system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
      code: clinicalStatus,
    },
    verificationStatus: !verificationStatus ? null : {
      system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
      code: verificationStatus,
    },
    bodySite: !bodySite ? null : bodySite.split('|').map((site) => ({
      system: 'http://snomed.info/sct',
      code: site,
    })),
    laterality: !laterality ? null : {
      system: 'http://snomed.info/sct',
      code: laterality,
      url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-laterality',
    },
    histology: !histology ? null : {
      system: 'http://snomed.info/sct',
      code: histology,
      url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-histology-morphology-behavior',
    },
  };
}

class CSVConditionExtractor extends Extractor {
  constructor({ filePath }) {
    super();
    this.csvModule = new CSVModule(path.resolve(filePath));
  }

  async getConditionData(mrn) {
    logger.debug('Getting Condition Data');
    const data = await this.csvModule.get('mrn', mrn);
    return data[0];
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
