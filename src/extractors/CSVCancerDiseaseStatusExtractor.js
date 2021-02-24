const path = require('path');
const { CSVModule } = require('../modules');
const { formatDateTime } = require('../helpers/dateUtils');
const { getDiseaseStatusDisplay, getDiseaseStatusEvidenceDisplay } = require('../helpers/diseaseStatusUtils');
const { generateMcodeResources } = require('../templates');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');

class CSVCancerDiseaseStatusExtractor {
  constructor({ filePath, implementation }) {
    this.csvModule = new CSVModule(path.resolve(filePath));
    this.implementation = implementation;
  }

  joinAndReformatData(arrOfDiseaseStatusData) {
    logger.debug('Reformatting disease status data from CSV into template format');
    // Check the shape of the data
    arrOfDiseaseStatusData.forEach((record) => {
      if (!record.mrn || !record.conditionId || (!record.diseaseStatusCode && record.observationStatus !== 'not-evaluated') || !record.dateOfObservation) {
        throw new Error('DiseaseStatusData missing an expected property: mrn, conditionId, diseaseStatusCode, and dateOfObservation are required.');
      }
    });
    const evidenceDelimiter = '|';
    return arrOfDiseaseStatusData.map((record) => ({
      status: record.observationStatus || 'final',
      // If the Disease Status was not evaluated, there will be no value to make a record of and this property will be null
      value: record.observationStatus === 'not-evaluated' ? null : {
        code: record.diseaseStatusCode,
        system: 'http://snomed.info/sct',
        display: record.diseaseStatusText ? record.diseaseStatusText : getDiseaseStatusDisplay(record.diseaseStatusCode, this.implementation),
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

  async getDiseaseStatusData(mrn, fromDate, toDate) {
    logger.debug('Getting disease status data');
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
    const packagedDiseaseStatusData = this.joinAndReformatData(diseaseStatusData);

    // 3. Generate FHIR Resources
    const resources = generateMcodeResources('CancerDiseaseStatus', packagedDiseaseStatusData);
    return resources;
  }
}

module.exports = {
  CSVCancerDiseaseStatusExtractor,
};
