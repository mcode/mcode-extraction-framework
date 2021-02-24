const {
  coding,
  extensionArr,
  reference,
  valueX,
  dataAbsentReasonExtension,
} = require('./snippets');

function evidenceTemplate({ evidence }) {
  if (!evidence || evidence.length === 0) return [];

  return evidence.map((e) => ({
    url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-evidence-type',
    ...valueX({ ...e, system: 'http://snomed.info/sct' }, 'valueCodeableConcept'),
  }));
}

function focusTemplate({ condition }) {
  return {
    focus: [
      reference({ ...condition, resourceType: 'Condition' }),
    ],
  };
}

function subjectTemplate({ subject }) {
  return {
    subject: reference({ ...subject, resourceType: 'Patient' }),
  };
}

function valueTemplate(valueObj) {
  if (valueObj === null) return { valueCodeableConcept: extensionArr(dataAbsentReasonExtension('not-asked')) };
  return valueX(valueObj, 'valueCodeableConcept');
}

function cancerDiseaseStatusTemplate({
  id,
  status,
  effectiveDateTime,
  condition,
  subject,
  value,
  evidence,
}) {
  if (!id || !status || !effectiveDateTime || !condition || !subject || (!value && status !== 'not evaluated')) {
    throw Error('Trying to render a CancerDiseaseStatusTemplate, but a required argument is missing; ensure that id, status, effectiveDateTime, condition, subject, and value are all present');
  }

  return {
    resourceType: 'Observation',
    id,
    meta: {
      profile: [
        'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-disease-status',
      ],
    },
    ...extensionArr(...evidenceTemplate({ evidence })),
    status: status === 'not evaluated' ? 'final' : status,
    category: [
      {
        coding: [
          coding({
            system:
              'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'therapy',
            display: 'Therapy',
          }),
        ],
      },
    ],
    code: {
      coding: [
        coding({
          system: 'http://loinc.org',
          code: '88040-1',
          display: 'Response to cancer treatment',
        }),
      ],
    },
    effectiveDateTime,
    ...focusTemplate({ condition }),
    ...subjectTemplate({ subject }),
    ...valueTemplate(value),
  };
}

module.exports = {
  cancerDiseaseStatusTemplate,
};
