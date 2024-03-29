const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { formatDateTime } = require('../helpers/dateUtils');
const logger = require('../helpers/logger');
const { CSVAdverseEventSchema } = require('../helpers/schemas/csv');

// Formats data to be passed into template-friendly format
function formatData(adverseEventData, patientId) {
  logger.debug('Reformatting adverse event data from CSV into template format');
  return adverseEventData.map((data) => {
    const {
      adverseeventid: adverseEventId,
      adverseeventcode: adverseEventCode,
      adverseeventcodesystem: adverseEventCodeSystem,
      adverseeventdisplaytext: adverseEventDisplayText,
      suspectedcauseid: suspectedCauseId,
      suspectedcausetype: suspectedCauseType,
      seriousness,
      seriousnesscodesystem: seriousnessCodeSystem,
      seriousnessdisplaytext: seriousnessDisplayText,
      category,
      categorycodesystem: categoryCodeSystem,
      categorydisplaytext: categoryDisplayText,
      severity,
      actuality,
      studyid: studyId,
      effectivedate: effectiveDate,
      recordeddate: recordedDate,
    } = data;

    if (!(adverseEventCode && effectiveDate)) {
      throw new Error('The adverse event is missing an expected attribute. Adverse event code and effective date are all required.');
    }

    const categoryCodes = category.split('|');
    const categorySystems = categoryCodeSystem.split('|');
    const categoryDisplays = categoryDisplayText.split('|');

    if (!(categoryCodes.length === categorySystems.length && categoryCodes.length === categoryDisplays.length)) {
      throw new Error('A category attribute on the adverse event is missing a corresponding categoryCodeSystem or categoryDisplayText value.');
    }


    return {
      ...(adverseEventId && { id: adverseEventId }),
      subjectId: patientId,
      code: adverseEventCode,
      system: !adverseEventCodeSystem ? 'http://snomed.info/sct' : adverseEventCodeSystem,
      display: adverseEventDisplayText,
      suspectedCauseId,
      suspectedCauseType,
      seriousnessCode: seriousness,
      seriousnessCodeSystem: !seriousnessCodeSystem ? 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness' : seriousnessCodeSystem,
      seriousnessDisplayText,
      category: categoryCodes.map((categoryCode, index) => {
        if (!categoryCode) return null;
        const categoryCoding = { code: categoryCode, system: categorySystems[index] ? categorySystems[index] : 'http://terminology.hl7.org/CodeSystem/adverse-event-category' };
        if (categoryDisplays[index]) categoryCoding.display = categoryDisplays[index];
        return categoryCoding;
      }),
      severity,
      actuality: !actuality ? 'actual' : actuality,
      studyId,
      effectiveDateTime: formatDateTime(effectiveDate),
      recordedDateTime: !recordedDate ? null : formatDateTime(recordedDate),
    };
  });
}

class CSVAdverseEventExtractor extends BaseCSVExtractor {
  constructor({
    filePath, url, fileName, dataDirectory, csvParse,
  }) {
    super({ filePath, url, fileName, dataDirectory, csvSchema: CSVAdverseEventSchema, csvParse });
  }

  async getAdverseEventData(mrn) {
    logger.debug('Getting Adverse Event Data');
    return this.csvModule.get('mrn', mrn);
  }

  async get({ mrn, context }) {
    const adverseEventData = await this.getAdverseEventData(mrn);
    if (adverseEventData.length === 0) {
      logger.warn('No adverse event data found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // Reformat data
    const formattedData = formatData(adverseEventData, patientId);

    // Fill templates
    return generateMcodeResources('AdverseEvent', formattedData);
  }
}

module.exports = {
  CSVAdverseEventExtractor,
};
