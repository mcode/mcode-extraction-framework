const {
  bodySiteTemplate,
  coding,
  extensionArr,
  reference,
  valueX,
} = require('./snippets');
const { ifAllArgsObj, ifSomeArgsObj } = require('../helpers/templateUtils');

function reasonTemplate({ reasonCode, reasonCodeSystem, reasonDisplayName }) {
  return {
    reasonCode: [
      {
        coding: [
          coding({
            system: reasonCodeSystem,
            code: reasonCode,
            display: reasonDisplayName,
          }),
        ],
      },
    ],
  };
}

function reasonReference(conditionId) {
  return {
    reasonReference: [
      reference({ id: conditionId, resourceType: 'Condition' }),
    ],
  };
}

function treatmentIntentTemplate({ treatmentIntent }) {
  return {
    url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-treatment-intent',
    ...valueX({
      system: 'http://snomed.info/sct',
      code: treatmentIntent,
    }, 'valueCodeableConcept'),
  };
}

function procedureBodySiteTemplate({ bodySite, laterality }) {
  if (!bodySite) return null;

  const bodySiteObj = bodySiteTemplate({ bodySite, laterality });
  return {
    bodySite: [
      bodySiteObj.bodySite,
    ],
  };
}

function procedureTemplate({
  id, subjectId, status, code, system, display, reasonCode, reasonCodeSystem, reasonDisplayName, conditionId, bodySite, laterality, effectiveDateTime, treatmentIntent,
}) {
  if (!(id && subjectId && status && code && system && effectiveDateTime)) {
    throw Error('Trying to render a ProcedureTemplate, but a required argument is missing; ensure that id, subjectId, status, code, system, and effectiveDateTime are all present');
  }

  return {
    resourceType: 'Procedure',
    id,
    status,
    code: {
      coding: [
        coding({ code, system, display }),
      ],
    },
    subject: reference({ id: subjectId, resourceType: 'Patient' }),
    performedDateTime: effectiveDateTime,
    ...ifSomeArgsObj(reasonTemplate)({ reasonCode, reasonCodeSystem, reasonDisplayName }),
    ...(conditionId && reasonReference(conditionId)),
    ...extensionArr(ifAllArgsObj(treatmentIntentTemplate)({ treatmentIntent })),
    ...ifSomeArgsObj(procedureBodySiteTemplate)({ bodySite, laterality }),
  };
}

module.exports = {
  procedureTemplate,
};
