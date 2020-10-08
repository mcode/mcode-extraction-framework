const { coding, reference, valueCodeableConcept } = require('./snippets');
const { ifAllArgsObj, ifSomeArgsObj } = require('../helpers/templateUtils');
const { isTumorMarker, isVitalSign, isKarnofskyPerformanceStatus, isECOGPerformanceStatus } = require('../helpers/observationUtils');
const { valueX } = require('./snippets/valueX');

function categoryTemplate({ code }) {
  if (isVitalSign(code)) {
    return {
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs',
            },
          ],
        },
      ],
    };
  }
  if (isTumorMarker(code)) {
    return {
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'laboratory',
            },
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
    subject: reference({ id: subjectId }),
  };
}

// TODO: We might want to consider a better way to handle the value field
// if we revisit the valueX inference approach at a later date
function valueTemplate({ code, valueCode, valueSystem }) {
  if (!(code && valueCode)) return null;

  if (isTumorMarker(code)) return valueCodeableConcept({ code: valueCode, system: valueSystem });
  if (isECOGPerformanceStatus(code) || isKarnofskyPerformanceStatus(code)) return valueX(parseInt(valueCode, 10));
  return valueX(valueCode); // Vital Sign will be parsed as quantity, others will be parsed as appropriate
}

function lateralityTemplate({ laterality }) {
  return {
    extension: [
      {
        url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-laterality',
        ...valueCodeableConcept({ code: laterality, system: 'http://snomed.info/sct' }),
      },
    ],
  };
}

function bodySiteTemplate({ bodySite, laterality }) {
  if (!bodySite) return null;

  return {
    bodySite: {
      ...ifAllArgsObj(lateralityTemplate)({ laterality }),
      coding: [coding({
        system: 'http://snomed.info/sct',
        code: bodySite,
      })],
    },
  };
}

/*
{
  id: String,
  subjectId: String,
  status: String,
  code: String,
  system: String,
  display: String,
  valueCode: String,
  valueSystem: String,
  effectiveDateTime: DateTime,
  bodySite: String,
  laterality: String
}
*/
function observationTemplate({
  id, subjectId, status, code, system, display, valueCode, valueSystem, effectiveDateTime, bodySite, laterality,
}) {
  if (!(id && subjectId && status && code && system && valueCode && effectiveDateTime)) {
    throw Error('Trying to render an ObservationTemplate, but a required argument is missing;'
      + ' ensure that id, subjectId, status, code, system, valueCode, and effectiveDateTime, are all present');
  }

  return {
    resourceType: 'Observation',
    id,
    status,
    ...categoryTemplate({ code }),
    ...ifSomeArgsObj(codeTemplate)({ code, system, display }),
    ...subjectTemplate({ subjectId }),
    effectiveDateTime,
    ...ifSomeArgsObj(valueTemplate)({ code, valueCode, valueSystem }),
    ...ifSomeArgsObj(bodySiteTemplate)({ bodySite, laterality }),
  };
}

module.exports = {
  observationTemplate,
};
