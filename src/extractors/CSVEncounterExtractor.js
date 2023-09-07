const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const { formatDateTime } = require('../helpers/dateUtils');
const { CSVEncounterSchema } = require('../helpers/schemas/csv');
const logger = require('../helpers/logger');

// Formats data to be passed into template-friendly format
function formatData(encounterData, patientId) {
  logger.debug('Reformatting encounter data from CSV into template format');
  return encounterData.map((data) => {
    const {
      encounterid: encounterId,
      status,
      classcode: classCode,
      classsystem: classSystem,
      typecode: typeCode,
      typesystem: typeSystem,
      startdate: startDate,
      enddate: endDate,
    } = data;

    if (!(status && classCode && classSystem)) {
      throw Error('Missing required field for Encounter CSV Extraction: status, classCode or classSystem');
    }

    return {
      ...(encounterId && { id: encounterId }),
      subject: {
        id: patientId,
      },
      status,
      classCode,
      classSystem,
      typeCode,
      typeSystem,
      startDate: !startDate ? null : formatDateTime(startDate),
      endDate: !endDate ? null : formatDateTime(endDate),
    };
  });
}

class CSVEncounterExtractor extends BaseCSVExtractor {
  constructor({
    filePath, url, fileName, dataDirectory, csvParse,
  }) {
    super({ filePath, url, fileName, dataDirectory, csvSchema: CSVEncounterSchema, csvParse });
  }

  async getEncounterData(mrn) {
    logger.debug('Getting Encounter Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn, context }) {
    const encounterData = await this.getEncounterData(mrn);
    if (encounterData.length === 0) {
      logger.warn('No encounter data found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // Reformat data
    const formattedData = formatData(encounterData, patientId);

    // Fill templates
    return generateMcodeResources('Encounter', formattedData);
  }
}

module.exports = {
  CSVEncounterExtractor,
};
