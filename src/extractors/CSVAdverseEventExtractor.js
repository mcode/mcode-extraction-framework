const path = require('path');
const { CSVModule } = require('../modules');
const { generatemCODEResources } = require('../templates');
const { Extractor } = require('./Extractor');
const logger = require('../helpers/logger');
const { formatDateTime } = require('../helpers/dateUtils');

// Formats data to be passed into template-friendly format
function formatData(adverseEventData) {
  logger.debug('Reformatting adverse event data from CSV into template format');
  return adverseEventData.map((data) => {
    const {
      mrn, adverseEventId, adverseEventCode, adverseEventCodeSystem, adverseEventDisplayText, suspectedCauseId, suspectedCauseType, seriousness, seriousnessCodeSystem, seriousnessDisplayText,
      category, categoryCodeSystem, categoryDisplayText, severity, actuality, studyId, effectiveDate, recordedDate,
    } = data;

    if (!(mrn && adverseEventCode && effectiveDate)) {
      throw new Error('The adverse event is missing an expected attribute. Adverse event code, mrn, and effective date are all required.');
    }
    return {
      id: adverseEventId,
      subjectId: mrn,
      code: adverseEventCode,
      system: adverseEventCodeSystem,
      display: adverseEventDisplayText,
      suspectedCauseId,
      suspectedCauseType,
      seriousnessCode: seriousness,
      seriousnessCodeSystem,
      seriousnessDisplayText,
      categoryCode: category,
      categoryCodeSystem,
      categoryDisplayText,
      severity,
      actuality,
      studyId,
      effectiveDateTime: formatDateTime(effectiveDate),
      recordedDateTime: formatDateTime(recordedDate),
    };
  });
}

class CSVAdverseEventExtractor extends Extractor {
  constructor({ filePath }) {
    super();
    this.CSVModule = new CSVModule(path.resolve(filePath));
  }

  async getAdverseEventData(mrn) {
    logger.debug('Getting Adverse Event Data');
    return this.CSVModule.get('mrn', mrn);
  }

  async get({ mrn }) {
    const adverseEventData = await this.getAdverseEventData(mrn);
    const formattedData = formatData(adverseEventData);

    return generatemCODEResources('AdverseEvent', formattedData);
  }
}

module.exports = {
  CSVAdverseEventExtractor,
};
