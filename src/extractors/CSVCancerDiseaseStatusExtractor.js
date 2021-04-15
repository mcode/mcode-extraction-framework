const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { formatDateTime } = require('../helpers/dateUtils');
const { getDiseaseStatusDisplay, getDiseaseStatusEvidenceDisplay } = require('../helpers/diseaseStatusUtils');
const { generateMcodeResources } = require('../templates');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');
const { CSVCancerDiseaseStatusSchema } = require('../helpers/schemas/csv');

class CSVCancerDiseaseStatusExtractor extends BaseCSVExtractor {
  constructor({ filePath, implementation }) {
    super({ filePath, csvSchema: CSVCancerDiseaseStatusSchema });
    this.implementation = implementation;
  }

  joinAndReformatData(arrOfDiseaseStatusData, patientId) {
    logger.debug('Reformatting disease status data from CSV into template format');
    // Check the shape of the data
    arrOfDiseaseStatusData.forEach((record) => {
      if (!record.conditionId || !record.diseaseStatusCode || !record.dateOfObservation) {
        throw new Error('DiseaseStatusData missing an expected property: conditionId, diseaseStatusCode, and dateOfObservation are required.');
      }
    });
    const evidenceDelimiter = '|';
    return arrOfDiseaseStatusData.map((record) => ({
      status: record.observationStatus || 'final',
      value: {
        code: record.diseaseStatusCode,
        system: 'http://snomed.info/sct',
        display: record.diseaseStatusText ? record.diseaseStatusText : getDiseaseStatusDisplay(record.diseaseStatusCode, this.implementation),
      },
      subject: {
        id: patientId,
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

  async get({ mrn, context, fromDate, toDate }) {
    // 1. Get all relevant data and do necessary post-processing
    const diseaseStatusData = await this.getDiseaseStatusData(mrn, fromDate, toDate);
    if (diseaseStatusData.length === 0) {
      logger.warn('No disease status data found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // 2. Format data for research study and research subject
    const packagedDiseaseStatusData = this.joinAndReformatData(diseaseStatusData, patientId);

    // 3. Generate FHIR Resources
    const resources = generateMcodeResources('CancerDiseaseStatus', packagedDiseaseStatusData);
    return resources;
  }
}

module.exports = {
  CSVCancerDiseaseStatusExtractor,
};
