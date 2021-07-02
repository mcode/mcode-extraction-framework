const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { formatDateTime } = require('../helpers/dateUtils');
const { getDiseaseStatusDisplay, getDiseaseStatusEvidenceDisplay } = require('../helpers/diseaseStatusUtils');
const { generateMcodeResources } = require('../templates');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');
const { CSVCancerDiseaseStatusSchema } = require('../helpers/schemas/csv');

class CSVCancerDiseaseStatusExtractor extends BaseCSVExtractor {
  constructor({ filePath, url, implementation }) {
    super({ filePath, url, csvSchema: CSVCancerDiseaseStatusSchema });
    this.implementation = implementation;
  }

  joinAndReformatData(arrOfDiseaseStatusData, patientId) {
    logger.debug('Reformatting disease status data from CSV into template format');
    // Check the shape of the data
    return arrOfDiseaseStatusData.map((record) => {
      const {
        conditionid: conditionId,
        diseasestatuscode: diseaseStatusCode,
        diseasestatustext: diseaseStatusText,
        dateofobservation: dateOfObservation,
        observationstatus: observationStatus,
        evidence,
      } = record;

      if (!conditionId || !diseaseStatusCode || !dateOfObservation) {
        throw new Error('DiseaseStatusData missing an expected property: conditionId, diseaseStatusCode, and dateOfObservation are required.');
      }

      return {
        status: observationStatus || 'final',
        value: {
          code: diseaseStatusCode,
          system: 'http://snomed.info/sct',
          display: diseaseStatusText || getDiseaseStatusDisplay(diseaseStatusCode, this.implementation),
        },
        subject: {
          id: patientId,
        },
        condition: {
          id: conditionId,
        },
        effectiveDateTime: formatDateTime(dateOfObservation),
        evidence: !evidence ? null : evidence.split('|').map((evidenceCode) => ({
          code: evidenceCode,
          display: getDiseaseStatusEvidenceDisplay(evidenceCode),
        })),
      };
    });
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
