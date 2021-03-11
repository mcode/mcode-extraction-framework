const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const logger = require('../helpers/logger');
const { formatDateTime } = require('../helpers/dateUtils');

function formatData(observationData) {
  logger.debug('Reformatting observation data from CSV into template format');
  return observationData.map((data) => {
    const {
      mrn, observationId, status, code, codeSystem, displayName, value, valueCodeSystem, effectiveDate, bodySite, laterality,
    } = data;

    if (!mrn || !observationId || !status || !code || !codeSystem || !value || !effectiveDate) {
      throw new Error('The observation is missing an expected attribute. Observation id, mrn, status, code, code system, value, and effective date are all required.');
    }

    return {
      id: observationId,
      subjectId: mrn,
      status,
      code,
      system: codeSystem,
      display: displayName,
      valueCode: value,
      valueCodeSystem,
      effectiveDateTime: formatDateTime(effectiveDate),
      bodySite,
      laterality,
    };
  });
}

class CSVObservationExtractor extends BaseCSVExtractor {
  constructor({ filePath }) {
    super({ filePath });
  }

  async getObservationData(mrn) {
    logger.debug('Getting Observation Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn }) {
    const observationData = await this.getObservationData(mrn);
    const formattedData = formatData(observationData);

    return generateMcodeResources('Observation', formattedData);
  }
}

module.exports = {
  CSVObservationExtractor,
};
