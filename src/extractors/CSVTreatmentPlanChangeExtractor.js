const path = require('path');
const _ = require('lodash');
const { Extractor } = require('./Extractor');
const { CSVModule } = require('../modules');
const { formatDate } = require('../helpers/dateUtils');
const { generateMcodeResources } = require('../templates');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');

// Formats data to be passed into template-friendly format
function formatData(tpcData) {
  logger.debug('Reformatting treatment plan change data from CSV into template format');

  // Nothing to format in empty array
  if (_.isEmpty(tpcData)) {
    return [];
  }

  // Newly combined data has mrn and list of reviews to map to an extension
  const combinedFormat = { mrn: tpcData[0].mrn, reviews: [] };

  // If there are multiple entries, combine them into one object with multiple reviews
  const combinedData = _.reduce(tpcData, (res, currentDataEntry) => {
    const {
      mrn, dateOfCarePlan, changed, reasonCode, reasonDisplayText,
    } = currentDataEntry;

    if (!mrn || !dateOfCarePlan || !changed) {
      throw new Error('Treatment Plan Change Data missing an expected property: mrn, dateOfCarePlan, changed are required');
    }

    // reasonCode is required if changed flag is true
    if (changed === 'true' && !reasonCode) {
      throw new Error('reasonCode is required when changed flag is true');
    }

    res.reviews.push({
      dateOfCarePlan,
      reasonCode,
      reasonDisplayText,
      changed,
    });
    return res;
  }, combinedFormat);

  // Format each entry in the reviews array
  combinedData.reviews = combinedData.reviews.map((review) => {
    const { dateOfCarePlan, changed, reasonCode, reasonDisplayText } = review;

    const formattedData = {
      effectiveDate: formatDate(dateOfCarePlan),
      hasChanged: changed,
    };

    // Add reasonCode to formattedData if available
    if (reasonCode) {
      formattedData.reasonCode = reasonCode;

      if (reasonDisplayText) {
        formattedData.reasonDisplayText = reasonDisplayText;
      }
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
