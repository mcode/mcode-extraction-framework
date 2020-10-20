const {
  bodySiteTemplate,
  coding,
  extensionArr,
  reference,
  valueCodeableConcept,
} = require('./snippets');
const { ifAllArgsObj, ifSomeArgsObj } = require('../helpers/templateUtils');

function reasonTemplate({ reasonCode, reasonCodeSystem, reasonDisplayName }) {
  return {
    reasonCode: {
      coding: [
        coding({
          system: reasonCodeSystem,
          code: reasonCode,
          display: reasonDisplayName,
        }),
      ],
    },
  };
}

function reasonReference(conditionId) {
  return {
    reasonReference: [
      reference({ id: conditionId }),
    ],
  };
}

function treatmentIntentTemplate({ treatmentIntent }) {
  return {
    url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-treatment-intent',
    ...valueCodeableConcept({
      system: 'http://snomed.info/sct',
      code: treatmentIntent,
    }),
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
    subject: reference({ id: subjectId }),
    performedDateTime: effectiveDateTime,
    ...ifSomeArgsObj(reasonTemplate)({ reasonCode, reasonCodeSystem, reasonDisplayName }),
    ...(conditionId && reasonReference(conditionId)),
    ...extensionArr(ifAllArgsObj(treatmentIntentTemplate)({ treatmentIntent })),
    ...ifSomeArgsObj(bodySiteTemplate)({ bodySite, laterality }),
  };
}

module.exports = {
  procedureTemplate,
};
