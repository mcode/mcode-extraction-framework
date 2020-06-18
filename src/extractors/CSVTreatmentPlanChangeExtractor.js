const path = require('path');
const { Extractor } = require('./Extractor');
const { CSVModule } = require('../modules');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const { formatDate, formatDateTime } = require('../helpers/dateUtils');
const logger = require('../helpers/logger');

// Formats data to be passed into template-friendly format
function formatData(tpcData) {
  return tpcData.map((data) => {
    const { mrn, dateOfCarePlan, changed, reasonCode } = data;
    if (!mrn || !dateOfCarePlan || !changed || !reasonCode) {
      throw new Error('Treatment Plan Change Data missing an expected property: mrn, dateOfCarePlan, reasonCode, changed are required');
    }

    return {
      effectiveDate: formatDate(dateOfCarePlan),
      effectiveDateTime: formatDateTime(dateOfCarePlan),
      treatmentPlanChange: {
        hasChanged: changed,
        reason: {
          code: reasonCode,
        },
      },
      subject: {
        id: mrn,
      },
    };
  });
}

class CSVTreatmentPlanChangeExtractor extends Extractor {
  constructor({ filePath }) {
    super();
    this.csvModule = new CSVModule(path.resolve(filePath));
  }

  async getTPCData(mrn, fromDate) {
    logger.info('Getting Treatment Plan Change Data');
    return this.csvModule.get('mrn', mrn, fromDate);
  }

  async get({ mrn, fromDate }) {
    const tpcData = await this.getTPCData(mrn, fromDate);
    if (tpcData.length === 0) {
      logger.warn('No disease status data found for patient');
      return {
        resourceType: 'Bundle',
        type: 'collection',
        entry: [],
      };
    }

    const formattedData = formatData(tpcData);

    return generateMcodeResources('CarePlanWithReview', formattedData);
  }
}

module.exports = {
  CSVTreatmentPlanChangeExtractor,
};
