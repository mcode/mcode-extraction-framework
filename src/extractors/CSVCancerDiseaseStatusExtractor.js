const path = require('path');
const { CSVModule } = require('../modules');
const { formatDateTime } = require('../helpers/dateUtils');
const { getDiseaseStatusDisplay, getDiseaseStatusEvidenceDisplay } = require('../helpers/diseaseStatusUtils');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');

function joinAndReformatData(arrOfDiseaseStatusData) {
  logger.info('Reformatting disease status data from CSV into template format');
  // Check the shape of the data
  arrOfDiseaseStatusData.forEach((record) => {
    if (!(record.mrn && record.conditionId && record.diseaseStatus && record.dateOfObservation)) {
      throw new Error('DiseaseStatusData missing an expected property: mrn, conditionId, diseaseStatus and dateOfObservation are required.');
    }
  });
  const evidenceDelimiter = '|';
  return arrOfDiseaseStatusData.map((record) => ({
    // We have no note to base our ObservationStatus off of; default to 'final'
    status: 'final',
    value: {
      code: record.diseaseStatus,
      system: 'http://snomed.info/sct',
      display: getDiseaseStatusDisplay(record.diseaseStatus),
    },
    subject: {
      id: record.mrn,
    },
    condition: {
      id: record.conditionId,
    },
    effectiveDateTime: formatDateTime(record.dateOfObservation),
    evidence: !record.evidence ? null : record.evidence.split(evidenceDelimiter).map((evidenceCode) => ({
      code: evidenceCode,
      display: getDiseaseStatusEvidenceDisplay(evidenceCode),
    })),
  }));
}

class CSVCancerDiseaseStatusExtractor {
  constructor({ filePath }) {
    this.csvModule = new CSVModule(path.resolve(filePath));
  }

  async getDiseaseStatusData(mrn, fromDate, toDate) {
    logger.info('Getting disease status data');
    return this.csvModule.get('mrn', mrn, fromDate, toDate);
  }

  async get({ mrn, fromDate, toDate }) {
    // 1. Get all relevant data and do necessary post-processing
    const diseaseStatusData = await this.getDiseaseStatusData(mrn, fromDate, toDate);
    if (diseaseStatusData.length === 0) {
      logger.warn('No disease status data found for patient');
      return getEmptyBundle();
    }

    // 2. Format data for research study and research subject
    const packagedDiseaseStatusData = joinAndReformatData(diseaseStatusData);

    // 3. Generate FHIR Resources
    const resources = generateMcodeResources('CancerDiseaseStatus', packagedDiseaseStatusData);
    return resources;
  }
}

module.exports = {
  CSVCancerDiseaseStatusExtractor,
};
