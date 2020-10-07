const { coding, extensionArr, reference, valueCodeableConcept } = require('./snippets');

function evidenceTemplate({ evidence }) {
  if (!evidence || evidence.length === 0) return [];

  return evidence.map((e) => ({
    url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-evidence-type',
    ...valueCodeableConcept({ ...e, system: 'http://snomed.info/sct' }),
  }));
}

function focusTemplate({ condition }) {
  return {
    focus: [
      reference(condition),
    ],
  };
}

function subjectTemplate({ subject }) {
  return {
    subject: reference(subject),
  };
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
  if (!(id && status && effectiveDateTime && condition && subject && value)) {
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
    status,
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
    ...valueCodeableConcept(value),
  };
}

module.exports = {
  cancerDiseaseStatusTemplate,
};
