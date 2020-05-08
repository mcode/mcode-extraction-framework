const { Extractor } = require('./Extractor');
const { CSVModule } = require('../modules');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const logger = require('../helpers/logger');

// Formats data to be passed into template-friendly format
function formatData(tpcData) {
  return tpcData.map((data) => {
    const { dateOfCarePlan, changed, reasonCode, subjectId } = data;
    if (!dateOfCarePlan || !changed || !reasonCode || !subjectId) {
      throw new Error('Treatment Plan Change Data missing an expected property: dateOfCarePlan, subjectId, reasonCode, changed are required');
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
        id: subjectId,
      },
    };
  });
}

class CSVTreatmentPlanChangeExtractor extends Extractor {
  constructor(csvPath) {
    super();
    this.csvModule = new CSVModule(csvPath);
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
