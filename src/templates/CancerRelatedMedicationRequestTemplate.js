const { coding,
  extensionArr,
  reference,
  valueX } = require('./snippets');
const { ifAllArgsObj } = require('../helpers/templateUtils');

function procedureIntentTemplate({ procedureIntent }) {
  return {
    url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-procedure-intent',
    ...valueX({ code: procedureIntent, system: 'http://snomed.info/sct' }, 'valueCodeableConcept'),
  };
}

function medicationTemplate({ code, codeSystem, displayText }) {
  return {
    medicationCodeableConcept: {
      coding: [coding({ system: codeSystem, code, display: displayText }),
      ],
    },
  };
}

function subjectTemplate({ id }) {
  return {
    subject: reference({ id, resourceType: 'Patient' }),
  };
}

function requesterTemplate({ id }) {
  return {
    requester: reference({ id }),
  };
}

function treatmentReasonTemplate({ treatmentReasonCode, treatmentReasonCodeSystem, treatmentReasonDisplayText }) {
  return {
    reasonCode: [
      {
        coding: [coding({ system: treatmentReasonCodeSystem, code: treatmentReasonCode, display: treatmentReasonDisplayText }),
        ],
      },
    ],
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
