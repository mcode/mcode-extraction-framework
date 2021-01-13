const path = require('path');
const _ = require('lodash');
const { Extractor } = require('./Extractor');
const { CSVModule } = require('../modules');
const { formatDate, formatDateTime } = require('../helpers/dateUtils');
const { generateMcodeResources } = require('../templates');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');

// Formats data to be passed into template-friendly format
function formatData(tpcData) {
  logger.debug('Reformatting treatment plan change data from CSV into template format');

  // If there are multiple entries, combine them into one object with multiple reviews
  const combinedData = _.reduce(tpcData, (res, n) => {
    if (!n.mrn || !n.dateOfCarePlan || !n.changed) {
      throw new Error('Treatment Plan Change Data missing an expected property: mrn, dateOfCarePlan, changed are required');
    }

    // reasonCode is required if changed flag is true
    if (n.changed === 'true' && !n.reasonCode) {
      throw new Error('reasonCode is required when changed flag is true');
    }

    if (!res.mrn) res.mrn = n.mrn;
    (res.reviews || (res.reviews = [])).push({
      dateOfCarePlan: n.dateOfCarePlan,
      reasonCode: n.reasonCode,
      changed: n.changed,
    });
    return res;
  }, {});

  // Format each entry in the reviews array
  combinedData.reviews = combinedData.reviews.map((reviews) => {
    const { dateOfCarePlan, changed, reasonCode } = reviews;

    const formattedData = {
      effectiveDate: formatDate(dateOfCarePlan),
      effectiveDateTime: formatDateTime(dateOfCarePlan),
      hasChanged: changed,
    };

    // Add reasonCode to formattedData if available
    if (reasonCode) {
      formattedData.reasonCode = reasonCode;
    }

    return formattedData;
  });

  // Array will contain one element to generate one FHIR resource with multiple extensions for reviews
  return [combinedData];
}

class CSVTreatmentPlanChangeExtractor extends Extractor {
  constructor({ filePath }) {
    super();
    this.csvModule = new CSVModule(path.resolve(filePath));
  }

  async getTPCData(mrn, fromDate, toDate) {
    logger.debug('Getting Treatment Plan Change Data');
    return this.csvModule.get('mrn', mrn, fromDate, toDate);
  }

  async get({ mrn, fromDate, toDate }) {
    const tpcData = await this.getTPCData(mrn, fromDate, toDate);
    if (tpcData.length === 0) {
      logger.warn('No treatment plan change data found for patient');
      return getEmptyBundle();
    }

    const formattedData = formatData(tpcData);

    return generateMcodeResources('CarePlanWithReview', formattedData);
  }
}

module.exports = {
  CSVTreatmentPlanChangeExtractor,
};
