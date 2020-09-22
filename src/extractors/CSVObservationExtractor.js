const path = require('path');
const { CSVModule } = require('../modules');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const { Extractor } = require('./Extractor');
const logger = require('../helpers/logger');
const { formatDate } = require('../helpers/dateUtils');
const { isVitalSign, getQuantityUnit } = require('../helpers/observationUtils');

function formatData(observationData) {
  logger.debug('Reformatting observation data from CSV into template format');
  return observationData.map((data) => {
    const {
      mrn, observationId, status, code, codeSystem, displayName, value, valueCodeSystem, effectiveDate, bodySite, laterality,
    } = data;

    if (!mrn || !observationId || !status || !code || !codeSystem || !value || !valueCodeSystem || !effectiveDate) {
      throw new Error('The observation is missing an expected attribute. Observation id, mrn, status, code, code system, value, value code system, and effective date are all required.');
    }

    return {
      id: observationId,
      subject: {
        id: mrn,
      },
      status,
      code: {
        code,
        system: codeSystem,
        display: !displayName ? null : displayName,
      },
      value: {
        code: value,
        system: !valueCodeSystem ? null : valueCodeSystem,
        unit: getQuantityUnit(valueCodeSystem),
      },
      effectiveDate: formatDate(effectiveDate),
      bodySite: !bodySite ? null : {
        code: bodySite,
      },
      laterality: !laterality ? null : {
        code: laterality,
      },
      isVitalSign: isVitalSign(code),
    };
  });
}

class CSVObservationExtractor extends Extractor {
  constructor({ filePath }) {
    super();
    this.csvModule = new CSVModule(path.resolve(filePath));
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
