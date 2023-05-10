const path = require('path');
const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { generateMcodeResources } = require('../templates');
const { getEmptyBundle } = require('../helpers/fhirUtils');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { formatDateTime } = require('../helpers/dateUtils');
const { getDisplayFromConcept } = require('../helpers/valueSetUtils');
const { ctcAEGradeCodeToTextLookup } = require('../helpers/lookups/ctcAdverseEventLookup');
const logger = require('../helpers/logger');
const { CSVCTCAdverseEventSchema } = require('../helpers/schemas/csv');

// Formats data to be passed into template-friendly format
function formatData(adverseEventData, patientId) {
  logger.debug('Reformatting adverse event data from CSV into template format');
  return adverseEventData.map((data) => {
    const {
      adverseeventid: adverseEventId,
      adverseeventcode: adverseEventCode,
      adverseeventcodesystem: adverseEventCodeSystem,
      adverseeventcodeversion: adverseEventCodeVersion,
      adverseeventdisplaytext: adverseEventDisplayText,
      adverseeventtext: adverseEventText,
      suspectedcauseid: suspectedCauseId,
      suspectedcausetype: suspectedCauseType,
      seriousness,
      seriousnesscodesystem: seriousnessCodeSystem,
      seriousnessdisplaytext: seriousnessDisplayText,
      category,
      categorycodesystem: categoryCodeSystem,
      categorydisplaytext: categoryDisplayText,
      studyid: studyId,
      effectivedate: effectiveDate,
      recordeddate: recordedDate,
      grade,
      expectation,
      resolveddate: resolvedDate,
      seriousnessoutcome: seriousnessOutcome,
      actor,
      functioncode: functionCode,
    } = data;

    if (!(adverseEventCode && effectiveDate && grade)) {
      throw new Error('The adverse event is missing an expected attribute. Adverse event code, effective date, and grade are all required.');
    } else if (functionCode && !actor) {
      throw new Error('The adverse event is missing an expected attribute. Adverse event actor is a required element when a functionCode value is included.');
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
      version: adverseEventCodeVersion,
      display: adverseEventDisplayText,
      text: adverseEventText,
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
      studyId,
      effectiveDateTime: formatDateTime(effectiveDate),
      recordedDateTime: !recordedDate ? null : formatDateTime(recordedDate),
      grade: { code: grade, display: ctcAEGradeCodeToTextLookup[grade] },
      resolvedDate: !resolvedDate ? null : formatDateTime(resolvedDate),
      expectation: !expectation ? null : {
        code: expectation,
        system: 'http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl',
        display: getDisplayFromConcept(
          path.resolve(__dirname, '..', 'helpers', 'valueSets', 'adverse-event-expectation-value-set.json'),
          expectation,
          'http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl',
        ),
      },
      seriousnessOutcome: !seriousnessOutcome ? null : {
        code: seriousnessOutcome,
        system: 'http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl',
        display: getDisplayFromConcept(
          path.resolve(__dirname, '..', 'helpers', 'valueSets', 'adverse-event-seriousness-outcome-value-set.json'),
          seriousnessOutcome,
          'http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl',
        ),
      },
      actor,
      functionCode: !functionCode ? null : {
        code: functionCode,
        system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
        display: getDisplayFromConcept(
          path.resolve(__dirname, '..', 'helpers', 'valueSets', 'adverse-event-participant-function-value-set.json'),
          functionCode,
          'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
        ),
      },
    };
  });
}

class CSVCTCAdverseEventExtractor extends BaseCSVExtractor {
  constructor({
    filePath, url, fileName, dataDirectory, csvParse,
  }) {
    super({ filePath, url, fileName, dataDirectory, csvSchema: CSVCTCAdverseEventSchema, csvParse });
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
    return generateMcodeResources('CTCAdverseEvent', formattedData);
  }
}

module.exports = {
  CSVCTCAdverseEventExtractor,
};
