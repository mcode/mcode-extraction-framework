const { coding, reference } = require('./snippets');
const { ifAllArgsObj, ifSomeArgsObj } = require('../helpers/templateUtils');

function eventTemplate({ eventCode, eventSystem, eventDisplay }) {
  let codeSystem = eventSystem;
  if (!codeSystem) {
    codeSystem = 'http://snomed.info/sct';
  }
  return {
    event: {
      coding: [
        coding({
          code: eventCode,
          system: codeSystem,
          display: eventDisplay,
        }),
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


function seriousnessTemplate({ seriousnessCode, seriousnessCodeSystem, seriousnessDisplayText }) {
  let codeSystem = seriousnessCodeSystem;
  if (!codeSystem) {
    codeSystem = 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness';
  }
  return {
    seriousness: {
      coding: [
        coding({
          code: seriousnessCode,
          system: codeSystem,
          display: seriousnessDisplayText,
        }),
      ],
    },
  };
}

function categoryTemplate({ categoryCode, categoryCodeSystem, categoryDisplayText }) {
  let codeSystem = categoryCodeSystem;
  if (!codeSystem) {
    codeSystem = 'http://terminology.hl7.org/CodeSystem/adverse-event-category';
  }
  return {
    category: {
      coding: [
        coding({
          code: categoryCode,
          system: codeSystem,
          display: categoryDisplayText,
        }),
      ],
    },
  };
}

function severityTemplate({ severityCode }) {
  return {
    severity: {
      coding: [
        coding({
          code: severityCode,
        }),
      ],
    },
  };
}

function actualityTemplate({ actuality }) {
  let actualityCode = actuality;
  if (!actualityCode) {
    actualityCode = 'https://www.hl7.org/fhir/valueset-adverse-event-actuality.html';
  }
  return {
    actuality: {
      coding: [
        coding({
          code: actualityCode,
        }),
      ],
    },
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
    ...ifAllArgsObj(suspectedCauseTemplate)({ id: suspectedCauseId, resourceType: suspectedCauseType }),
    ...ifSomeArgsObj(seriousnessTemplate)({ seriousnessCode, seriousnessCodeSystem, seriousnessDisplayText }),
    ...ifSomeArgsObj(categoryTemplate)({ categoryCode, categoryCodeSystem, categoryDisplayText }),
    ...ifAllArgsObj(severityTemplate)({ severity }),
    ...actualityTemplate(actuality),
    study: reference({ id: studyId, resourceType: 'ResearchStudy' }),
    date: effectiveDateTime,
    recordedDate: recordedDateTime,
  };
}

module.exports = {
  adverseEventTemplate,
};
