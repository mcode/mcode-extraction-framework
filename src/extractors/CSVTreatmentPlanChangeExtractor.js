const path = require('path');
const { Extractor } = require('./Extractor');
const { CSVModule } = require('../modules');
const { formatDate, formatDateTime } = require('../helpers/dateUtils');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');

// Formats data to be passed into template-friendly format
function formatData(tpcData) {
  return tpcData.map((data) => {
    const { mrn, dateOfCarePlan, changed, reasonCode } = data;
    if (!mrn || !dateOfCarePlan || !changed) {
      throw new Error('Treatment Plan Change Data missing an expected property: mrn, dateOfCarePlan, changed are required');
    }

    // reasonCode is required if changed flag is true
    if (changed === 'true' && !reasonCode) {
      throw new Error('reasonCode is required when changed flag is true');
    }

    const formattedData = {
      effectiveDate: formatDate(dateOfCarePlan),
      effectiveDateTime: formatDateTime(dateOfCarePlan),
      treatmentPlanChange: {
        hasChanged: changed,
      },
      subject: {
        id: mrn,
      },
    };

    // Add reasonCode to formattedData if available
    if (reasonCode) {
      formattedData.treatmentPlanChange.reason = {
        code: reasonCode,
      };
    }

    return formattedData;
  });
}

class CSVTreatmentPlanChangeExtractor extends Extractor {
  constructor({ filePath }) {
    super();
    this.csvModule = new CSVModule(path.resolve(filePath));
  }

  async getTPCData(mrn, fromDate, toDate) {
    logger.info('Getting Treatment Plan Change Data');
    return this.csvModule.get('mrn', mrn, fromDate, toDate);
  }

  async get({ mrn, fromDate, toDate }) {
    const tpcData = await this.getTPCData(mrn, fromDate, toDate);
    if (tpcData.length === 0) {
      logger.warn('No disease status data found for patient');
      return getEmptyBundle();
    }

    const formattedData = formatData(tpcData);

    return generateMcodeResources('CarePlanWithReview', formattedData);
  }
}

module.exports = {
  CSVTreatmentPlanChangeExtractor,
};
