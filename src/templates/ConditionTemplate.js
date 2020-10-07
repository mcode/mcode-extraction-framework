const { extension, coding, valueCodeableConcept, reference } = require('./snippets');
const { ifAllArgsObj } = require('../helpers/templateUtils');

function histologyTemplate({ histology }) {
  return {
    url: histology.url,
    ...valueCodeableConcept({ ...histology }),
  };
}

function dateOfDiagnosisTemplate({ dateOfDiagnosis }) {
  return {
    url: dateOfDiagnosis.url,
    valueDateTime: dateOfDiagnosis.value,
  };
}

function clinicalStatusTemplate({ clinicalStatus }) {
  return {
    clinicalStatus: {
      coding: [coding({ ...clinicalStatus }),
      ],
    },
  };
}

function verificationStatusTemplate({ verificationStatus }) {
  return {
    verificationStatus: {
      coding: [coding({ ...verificationStatus }),
      ],
    },
  };
}

function individualCategoryTemplate(category) {
  return {
    coding: [coding({ ...category }),
    ],
  };
}

function categoryArrayTemplate(array) {
  const category = array.map(individualCategoryTemplate);
  // Including the fixed value for the category element at the end of the array
  category.push({
    coding: [coding({
      system: 'http://snomed.info/sct',
      code: '64572001',
    }),
    ],
  });
  return { category };
}

function codingTemplate({ code }) {
  return {
    code: {
      coding: [coding({ ...code }),
      ],
    },
  };
}

function bodySiteTemplate({ bodySite, laterality }) {
  return {
    bodySite: [
      {
        extension: [
          {
            url: laterality.url,
            ...valueCodeableConcept({ ...laterality }),
          },
        ],
        coding: [coding({ ...bodySite[0] }),
        ],
      },
    ],
  };
}

function subjectTemplate({ subject }) {
  return {
    subject: reference(subject),
  };
}

// Based on https://mcodeinitiative.github.io/StructureDefinition-obf-Condition.html
// Official url: http://hl7.org/fhir/us/mcode/StructureDefinition/obf-Condition
function conditionTemplate({
  subject, id, code, category, dateOfDiagnosis, clinicalStatus, verificationStatus, bodySite, laterality, histology,
}) {
  if (!(id && subject && code.system && code.code && category)) {
    throw Error('Trying to render a ConditionTemplate, but a required argument is missing; ensure that id, mrn, code, codesystem, and category are all present');
  }

  return {
    resourceType: 'Condition',
    id,
    ...extension(
      ifAllArgsObj(dateOfDiagnosisTemplate)({ dateOfDiagnosis }),
      ifAllArgsObj(histologyTemplate)({ histology }),
    ),
    ...ifAllArgsObj(clinicalStatusTemplate)({ clinicalStatus }),
    ...ifAllArgsObj(verificationStatusTemplate)({ verificationStatus }),
    ...categoryArrayTemplate(category),
    ...codingTemplate({ code }),
    ...ifAllArgsObj(bodySiteTemplate)({ bodySite, laterality }),
    ...subjectTemplate({ subject }),
  };
}

module.exports = {
  conditionTemplate,
};
