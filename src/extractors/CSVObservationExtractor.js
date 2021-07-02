const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const { formatDateTime } = require('../helpers/dateUtils');
const logger = require('../helpers/logger');

function formatData(observationData, patientId) {
  logger.debug('Reformatting observation data from CSV into template format');
  return observationData.map((data) => {
    const {
      observationid: observationId,
      status,
      code,
      codesystem: codeSystem,
      displayname: displayName,
      value,
      valuecodesystem: valueCodeSystem,
      effectivedate: effectiveDate,
      bodysite: bodySite,
      laterality,
    } = data;

    if (!observationId || !status || !code || !codeSystem || !value || !effectiveDate) {
      throw new Error('The observation is missing an expected attribute. Observation id, status, code, code system, value, and effective date are all required.');
    }

    return {
      id: observationId,
      subjectId: patientId,
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
  constructor({ filePath, url }) {
    super({ filePath, url });
  }

  async getObservationData(mrn) {
    logger.debug('Getting Observation Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn, context }) {
    const observationData = await this.getObservationData(mrn);
    if (observationData.length === 0) {
      logger.warn('No observation data found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // Reformat data
    const formattedData = formatData(observationData, patientId);

    // Fill template
    return generateMcodeResources('Observation', formattedData);
  }
}

module.exports = {
  CSVObservationExtractor,
};
