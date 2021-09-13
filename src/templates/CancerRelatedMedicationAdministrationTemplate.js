const {
  coding,
  dataAbsentReasonExtension,
  extensionArr,
  reference,
  valueX,
} = require('./snippets');
const { ifAllArgsObj } = require('../helpers/templateUtils');

function treatmentIntentTemplate({ treatmentIntent }) {
  return {
    url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-treatment-intent',
    ...valueX({ code: treatmentIntent, system: 'http://snomed.info/sct' }, 'valueCodeableConcept'),
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

function periodTemplate({ startDate, endDate }) {
  // If start and end date are not provided, indicate data absent with extension.
  if (!startDate && !endDate) {
    return {
      effectivePeriod: extensionArr(dataAbsentReasonExtension('unknown')),
    };
  }

  return {
    effectivePeriod: {
      ...(startDate && { start: startDate }),
      ...(endDate && { end: endDate }),
    },
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


function cancerRelatedMedicationAdministrationTemplate({
  subjectId,
  id,
  code,
  codeSystem,
  displayText,
  startDate,
  endDate,
  treatmentReasonCode,
  treatmentReasonCodeSystem,
  treatmentReasonDisplayText,
  treatmentIntent,
  status,
}) {
  if (!(subjectId && code && codeSystem && status)) {
    throw Error('Trying to render a CancerRelatedMedicationAdministrationTemplate, but a required argument is missing; ensure that subjectId, code, code system, and status are all present');
  }

  return {
    resourceType: 'MedicationAdministration',
    id,
    meta: {
      profile: [
        'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-related-medication-administration',
      ],
    },
    ...extensionArr(ifAllArgsObj(treatmentIntentTemplate)({ treatmentIntent })),
    status,
    ...medicationTemplate({ code, codeSystem, displayText }),
    ...ifAllArgsObj(subjectTemplate)({ id: subjectId }),
    ...periodTemplate({ startDate, endDate }),
    ...ifAllArgsObj(treatmentReasonTemplate)({ treatmentReasonCode, treatmentReasonCodeSystem, treatmentReasonDisplayText }),
  };
}

module.exports = {
  cancerRelatedMedicationAdministrationTemplate,
};
