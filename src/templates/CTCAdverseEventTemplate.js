const { coding, reference, extensionArr } = require('./snippets');
const { ifAllArgsObj, ifSomeArgsObj, ifAllArgs, ifSomeArgsArr } = require('../helpers/templateUtils');

function eventTemplate(eventCoding, eventText) {
  return {
    event: {
      coding: [
        coding(eventCoding),
      ],
      text: eventText,
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

function CTCAdverseEventTemplate({
  id, subjectId, code, system, version, display, text, suspectedCauseId, suspectedCauseType, seriousnessCode, seriousnessCodeSystem, seriousnessDisplayText, category,
  studyId, effectiveDateTime, recordedDateTime, grade,
}) {
  if (!(subjectId && code && system && text && effectiveDateTime && grade)) {
    throw Error('Trying to render an AdverseEventTemplate, but a required argument is messing; ensure that subjectId, code, system, text, grade, and effectiveDateTime are all present');
  }

  return {
    resourceType: 'AdverseEvent',
    id,
    ...extensionArr(gradeTemplate(grade)),
    subject: reference({ id: subjectId, resourceType: 'Patient' }),
    ...ifAllArgs(eventTemplate)({ code, system, version, display }, text),
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
