const {
  extensionArr,
  reference,
  valueX,
  medicationTemplate,
  subjectTemplate,
  treatmentReasonTemplate,
  coding,
} = require('./snippets');
const { ifAllArgsObj, ifSomeArgsObj } = require('../helpers/templateUtils');
const { formatDateTime } = require('../helpers/dateUtils');

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

function doseQuantityTemplate({ doseQuantityValue, doseQuantityUnit }) {
  return {
    doseQuantity: {
      value: parseFloat(doseQuantityValue),
      unit: doseQuantityUnit,
    },
  };
}

function doseAndRateTemplate({ doseRateType, doseQuantityValue, doseQuantityUnit }) {
  return {
    doseAndRate: [{
      type: { coding: [coding({ code: doseRateType, system: 'http://terminology.hl7.org/CodeSystem/dose-rate-type' })] },
      ...ifSomeArgsObj(doseQuantityTemplate)({ doseQuantityValue, doseQuantityUnit }),
    }],
  };
}

function dosageInstructionTemplate({
  dosageRoute, asNeededCode, doseRateType, doseQuantityValue, doseQuantityUnit,
}) {
  return {
    dosageInstruction: [{
      route: { coding: [coding({ code: dosageRoute, system: 'http://snomed.info/sct' })] },
      asNeededCodeableConcept: { coding: [coding({ code: asNeededCode, system: 'http://snomed.info/sct' })] },
      ...ifSomeArgsObj(doseAndRateTemplate)({ doseRateType, doseQuantityValue, doseQuantityUnit }),
    }],
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
  dosageRoute,
  asNeededCode,
  doseRateType,
  doseQuantityValue,
  doseQuantityUnit,
}) {
  if (!(subjectId && code && codeSystem && status && intent && requesterId)) {
    const e1 = 'Trying to render a CancerRelatedMedicationRequestTemplate, but a required argument is missing; ';
    const e2 = 'ensure that subjectId, code, codeSystem, intent, requesterId, and status are all present';
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
    ...ifSomeArgsObj(dosageInstructionTemplate)({ dosageRoute, asNeededCode, doseRateType, doseQuantityValue, doseQuantityUnit }),
    ...ifAllArgsObj(subjectTemplate)({ id: subjectId }),
    ...(authoredOn && { authoredOn: formatDateTime(authoredOn) }),
    ...ifAllArgsObj(requesterTemplate)({ id: requesterId }),
    ...ifAllArgsObj(treatmentReasonTemplate)({ treatmentReasonCode, treatmentReasonCodeSystem, treatmentReasonDisplayText }),
  };
}

module.exports = {
  cancerRelatedMedicationRequestTemplate,
};
