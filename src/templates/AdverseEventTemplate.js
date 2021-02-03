const { coding, reference } = require('./snippets');
const { ifAllArgsObj, ifSomeArgsObj, ifAllArgs } = require('../helpers/templateUtils');

function eventTemplate(eventCoding) {
  return {
    event: {
      coding: [
        coding(eventCoding),
      ],
    },
  };
}

function suspectedCauseTemplate({ suspectedCauseId, suspectedCauseType }) {
  return {
    suspectEntity: [
      {
        instance:
          reference({ id: suspectedCauseId, resourceType: suspectedCauseType }),
      },
    ],
  };
}


function seriousnessTemplate(seriousnessCoding) {
  return {
    seriousness: {
      coding: [
        coding(seriousnessCoding),
      ],
    },
  };
}

function categoryTemplate(categoryCoding) {
  return {
    category: [{
      coding: [
        coding(categoryCoding),
      ],
    }],
  };
}

function severityTemplate(severityCode) {
  return {
    severity: {
      coding: [
        coding({
          code: severityCode,
          system: 'http://terminology.hl7.org/CodeSystem/adverse-event-severity',
        }),
      ],
    },
  };
}

function studyTemplate(studyId) {
  return {
    study: [
      reference({ id: studyId, resourceType: 'ResearchStudy' }),
    ],
  };
}

function recordedDateTemplate(recordedDateTime) {
  return {
    recordedDate: recordedDateTime,
  };
}

function adverseEventTemplate({
  id, subjectId, code, system, display, suspectedCauseId, suspectedCauseType, seriousnessCode, seriousnessCodeSystem, seriousnessDisplayText, categoryCode, categoryCodeSystem, categoryDisplayText,
  severity, actuality, studyId, effectiveDateTime, recordedDateTime,
}) {
  if (!(subjectId && code && effectiveDateTime)) {
    throw Error('Trying to render an AdverseEventTemplate, but a required argument is messing; ensure that subjectId, code and effectiveDateTime are all present');
  }

  return {
    resourceType: 'AdverseEvent',
    id,
    subject: reference({ id: subjectId, resourceType: 'Patient' }),
    ...ifSomeArgsObj(eventTemplate)({ code, system, display }),
    ...ifAllArgsObj(suspectedCauseTemplate)({ suspectedCauseId, suspectedCauseType }),
    ...ifSomeArgsObj(seriousnessTemplate)({ code: seriousnessCode, system: seriousnessCodeSystem, display: seriousnessDisplayText }),
    ...ifSomeArgsObj(categoryTemplate)({ code: categoryCode, system: categoryCodeSystem, display: categoryDisplayText }),
    ...ifAllArgs(severityTemplate)(severity),
    actuality,
    ...ifAllArgs(studyTemplate)(studyId),
    date: effectiveDateTime,
    ...ifAllArgs(recordedDateTemplate)(recordedDateTime),
  };
}

module.exports = {
  adverseEventTemplate,
};
