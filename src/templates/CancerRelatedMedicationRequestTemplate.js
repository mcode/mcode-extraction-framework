const {
  extensionArr,
  reference,
  valueX,
  medicationTemplate,
  subjectTemplate,
  treatmentReasonTemplate,
} = require('./snippets');
const { ifAllArgsObj } = require('../helpers/templateUtils');

function procedureIntentTemplate({ procedureIntent }) {
  return {
    url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-procedure-intent',
    ...valueX({ code: procedureIntent, system: 'http://snomed.info/sct' }, 'valueCodeableConcept'),
  };
}

function requesterTemplate({ id }) {
  return {
    requester: reference({ id }),
  };
}

function cancerRelatedMedicationRequestTemplate({
  subjectId,
  id,
  code,
  codeSystem,
  displayText,
  treatmentReasonCode,
  treatmentReasonCodeSystem,
  treatmentReasonDisplayText,
  procedureIntent,
  status,
  intent,
  authoredOn,
  requesterId,
}) {
  if (!(subjectId && code && codeSystem && status && intent && requesterId && authoredOn)) {
    const e1 = 'Trying to render a CancerRelatedMedicationRequestTemplate, but a required argument is missing; ';
    const e2 = 'ensure that subjectId, code, codeSystem, intent, requesterId, authoredOn, and status are all present';
    throw Error(e1 + e2);
  }

  return {
    resourceType: 'MedicationRequest',
    id,
    meta: {
      profile: [
        'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-related-medication-request',
      ],
    },
    ...extensionArr(ifAllArgsObj(procedureIntentTemplate)({ procedureIntent })),
    status,
    intent,
    ...medicationTemplate({ code, codeSystem, displayText }),
    ...ifAllArgsObj(subjectTemplate)({ id: subjectId }),
    authoredOn,
    ...ifAllArgsObj(requesterTemplate)({ id: requesterId }),
    ...ifAllArgsObj(treatmentReasonTemplate)({ treatmentReasonCode, treatmentReasonCodeSystem, treatmentReasonDisplayText }),
  };
}

module.exports = {
  cancerRelatedMedicationRequestTemplate,
};
