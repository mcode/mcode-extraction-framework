const { coding, reference } = require('./snippets');
const { ifAllArgsObj, ifSomeArgsObj, ifAllArgs, ifSomeArgsArr } = require('../helpers/templateUtils');

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

function individualCategoryTemplate(category) {
  return {
    coding: [coding(category),
    ],
  };
}

function categoryArrayTemplate(categoryArr) {
  const category = categoryArr.map(individualCategoryTemplate);
  return { category };
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
  id, subjectId, code, system, display, suspectedCauseId, suspectedCauseType, seriousnessCode, seriousnessCodeSystem, seriousnessDisplayText, category,
  severity, actuality, studyId, effectiveDateTime, recordedDateTime,
}) {
  if (!(subjectId && code && system && effectiveDateTime && actuality)) {
    throw Error('Trying to render an AdverseEventTemplate, but a required argument is messing; ensure that subjectId, code, system, actuality, and effectiveDateTime are all present');
  }

  return {
    resourceType: 'AdverseEvent',
    id,
    subject: reference({ id: subjectId, resourceType: 'Patient' }),
    ...ifSomeArgsObj(eventTemplate)({ code, system, display }),
    ...ifAllArgsObj(suspectedCauseTemplate)({ suspectedCauseId, suspectedCauseType }),
    ...ifSomeArgsObj(seriousnessTemplate)({ code: seriousnessCode, system: seriousnessCodeSystem, display: seriousnessDisplayText }),
    ...ifSomeArgsArr(categoryArrayTemplate)(category),
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
