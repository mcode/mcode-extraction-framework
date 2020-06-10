const path = require('path');
const { CSVModule } = require('../modules');
const { getDiseaseStatusCode } = require('../helpers/diseaseStatusUtils');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const { formatDateTime } = require('../helpers/dateUtils');
const logger = require('../helpers/logger');

function joinAndReformatData(arrOfDiseaseStatusData) {
  logger.info('Reformatting disease status data from CSV into template format');
  // No join needed - just reformatting for template
  // Check the shape of the data
  arrOfDiseaseStatusData.forEach((record) => {
    if (!(record.mrn && record.conditionId && record.diseaseStatus && record.dateOfObservation)) {
      throw new Error('DiseaseStatusData missing an expected property: mrn, conditionId, diseaseStatus and dateOfObservation are required.');
    }
  });
  return arrOfDiseaseStatusData.map((record) => ({
    // We have no note to base our ObservationStatus off of; default to 'final'
    status: 'final',
    value: {
      code: getDiseaseStatusCode(record.diseaseStatus),
      system: 'http://snomed.info/sct',
      display: record.diseaseStatus,
    },
    subject: {
      id: record.mrn,
    },
    condition: {
      id: record.conditionId,
    },
    effectiveDateTime: formatDateTime(record.dateOfObservation),
  }));
}

class CSVCancerDiseaseStatusExtractor {
  constructor({ filePath }) {
    this.csvModule = new CSVModule(path.resolve(filePath));
  }

  async getDiseaseStatusData(mrn) {
    logger.info('Getting disease status data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn }) {
    // 1. Get all relevant data and do necessary post-processing
    const diseaseStatusData = await this.getDiseaseStatusData(mrn);

    // 2. Format data for research study and research subject
    const packagedDiseaseStatusData = joinAndReformatData(diseaseStatusData);

    // 3. Generate FHIR Resources
    return generateMcodeResources('CancerDiseaseStatus', packagedDiseaseStatusData);
  }
}

module.exports = {
  CSVCancerDiseaseStatusExtractor,
};
