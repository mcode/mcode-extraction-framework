const { bodySiteTemplate, coding, reference, valueX } = require('./snippets');
const { ifSomeArgsObj } = require('../helpers/templateUtils');
const { isTumorMarker, isVitalSign, isKarnofskyPerformanceStatus, isECOGPerformanceStatus } = require('../helpers/observationUtils');

function categoryTemplate({ code, system }) {
  if (isVitalSign(code)) {
    return {
      category: [
        {
          coding: [
            coding({
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs',
            }),
          ],
        },
      ],
    };
  }
  if (isTumorMarker(code, system)) {
    return {
      category: [
        {
          coding: [
            coding({
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'laboratory',
            }),
          ],
        },
      ],
    };
  }
  return null;
}

function codeTemplate({ code, system, display }) {
  return {
    code: {
      coding: [
        coding({ code, system, display }),
      ],
    },
  };
}

function subjectTemplate({ subjectId }) {
  return {
    subject: reference({ id: subjectId, resourceType: 'Patient' }),
  };
}

function valueTemplate({ code, system, valueCode, valueCodeSystem }) {
  if (!(code && valueCode)) return null;
  if (isTumorMarker(code, system)) return valueX({ code: valueCode, system: valueCodeSystem }, 'valueCodeableConcept');
  if (isECOGPerformanceStatus(code) || isKarnofskyPerformanceStatus(code)) return valueX(valueCode, 'valueInteger');
  return valueX(valueCode); // Vital Sign will be parsed as quantity, others will be parsed as appropriate
}

function observationTemplate({
  id, subjectId, status, code, system, display, valueCode, valueCodeSystem, effectiveDateTime, bodySite, laterality,
}) {
  if (!(id && subjectId && status && code && system && valueCode && effectiveDateTime)) {
    throw Error('Trying to render an ObservationTemplate, but a required argument is missing;'
      + ' ensure that id, subjectId, status, code, system, valueCode, and effectiveDateTime, are all present');
  }

  return {
    resourceType: 'Observation',
    id,
    status,
    ...categoryTemplate({ code, system }),
    ...ifSomeArgsObj(codeTemplate)({ code, system, display }),
    ...subjectTemplate({ subjectId }),
    effectiveDateTime,
    ...ifSomeArgsObj(valueTemplate)({ code, system, valueCode, valueCodeSystem }),
    ...ifSomeArgsObj(bodySiteTemplate)({ bodySite, laterality }),
  };
}

module.exports = {
  observationTemplate,
};
