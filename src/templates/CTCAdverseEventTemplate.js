const { coding, reference, extensionArr, valueX } = require('./snippets');
const {
  ifAllArgsObj, ifSomeArgsObj, ifAllArgs, ifSomeArgs, ifSomeArgsArr,
} = require('../helpers/templateUtils');

function eventTemplate(eventCoding, eventText) {
  return {
    event: {
      coding: [
        coding(eventCoding),
      ],
      ...(eventText && { text: eventText }),
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

function gradeTemplate(grade) {
  return {
    url: 'http://hl7.org/fhir/us/ctcae/StructureDefinition/ctcae-grade',
    valueCodeableConcept: {
      coding: [
        coding({ ...grade, system: 'http://hl7.org/fhir/us/ctcae/CodeSystem/ctcae-grade-code-system' }),
      ],
    },
  };
}

function resolvedDateTemplate(resolvedDate) {
  return {
    url: 'http://hl7.org/fhir/us/ctcae/StructureDefinition/adverse-event-resolved-date',
    ...valueX(resolvedDate, 'valueDateTime'),
  };
}

function expectationTemplate(expectation) {
  return {
    url: 'http://hl7.org/fhir/us/ctcae/StructureDefinition/adverse-event-expectation',
    valueCodeableConcept: {
      coding: [
        coding(expectation),
      ],
    },
  };
}

function seriousnessOutcomeTemplate(seriousnessOutcome) {
  return {
    url: 'http://hl7.org/fhir/us/ctcae/StructureDefinition/adverse-event-seriousness-outcome',
    valueCodeableConcept: {
      coding: [
        coding(seriousnessOutcome),
      ],
    },
  };
}

function participantFunctionTemplate(functionCode) {
  return {
    url: 'function',
    valueCodeableConcept: {
      coding: [
        coding(functionCode),
      ],
    },
  };
}

function participantActorTemplate(actor) {
  return {
    url: 'actor',
    valueReference: {
      reference: reference({ id: actor }),
    },
  };
}

function participantTemplate(actor, functionCode) {
  return {
    url: 'http://hl7.org/fhir/us/ctcae/StructureDefinition/adverse-event-participant',
    ...extensionArr(
      functionCode ? participantFunctionTemplate(functionCode) : null,
      participantActorTemplate(actor),
    ),
  };
}


function CTCAdverseEventTemplate({
  id, subjectId, code, system, version, display, text, suspectedCauseId, suspectedCauseType, seriousnessCode, seriousnessCodeSystem, seriousnessDisplayText, category,
  studyId, effectiveDateTime, recordedDateTime, grade, resolvedDate, expectation, seriousnessOutcome, actor, functionCode,
}) {
  if (!(subjectId && code && system && effectiveDateTime && grade)) {
    throw Error('Trying to render an AdverseEventTemplate, but a required argument is missing; ensure that subjectId, code, system, grade, and effectiveDateTime are all present');
  }

  if (functionCode && !actor) {
    throw Error('Trying to render an AdverseEventTemplate, but a required argument is missing; actor is a required value');
  }

  return {
    resourceType: 'AdverseEvent',
    id,
    ...extensionArr(
      gradeTemplate(grade),
      resolvedDate ? resolvedDateTemplate(resolvedDate) : null,
      expectation ? expectationTemplate(expectation) : null,
      seriousnessOutcome ? seriousnessOutcomeTemplate(seriousnessOutcome) : null,
      actor ? participantTemplate(actor, functionCode) : null,
    ),
    subject: reference({ id: subjectId, resourceType: 'Patient' }),
    ...ifSomeArgs(eventTemplate)({ code, system, version, display }, text),
    ...ifAllArgsObj(suspectedCauseTemplate)({ suspectedCauseId, suspectedCauseType }),
    ...ifSomeArgsObj(seriousnessTemplate)({ code: seriousnessCode, system: seriousnessCodeSystem, display: seriousnessDisplayText }),
    ...ifSomeArgsArr(categoryArrayTemplate)(category),
    actuality: 'actual',
    ...ifAllArgs(studyTemplate)(studyId),
    date: effectiveDateTime,
    ...ifAllArgs(recordedDateTemplate)(recordedDateTime),
  };
}

module.exports = {
  CTCAdverseEventTemplate,
};
