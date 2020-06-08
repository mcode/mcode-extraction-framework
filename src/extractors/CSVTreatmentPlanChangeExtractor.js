const path = require('path');
const { Extractor } = require('./Extractor');
const { CSVModule } = require('../modules');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const logger = require('../helpers/logger');

// Formats data to be passed into template-friendly format
function formatData(tpcData) {
  return tpcData.map((data) => {
    const { mrn, dateOfCarePlan, changed, reasonCode } = data;
    if (!mrn || !dateOfCarePlan || !changed || !reasonCode) {
      throw new Error('Treatment Plan Change Data missing an expected property: mrn, dateOfCarePlan, reasonCode, changed are required');
    }

    return {
      effectiveDate: dateOfCarePlan,
      effectiveDateTime: dateOfCarePlan,
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

  async getTPCData(mrn) {
    logger.info('Getting Treatment Plan Change Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn }) {
    const tpcData = await this.getTPCData(mrn);
    const formattedData = formatData(tpcData);

    return generateMcodeResources('CarePlanWithReview', formattedData);
  }
}

module.exports = {
  CSVTreatmentPlanChangeExtractor,
};
