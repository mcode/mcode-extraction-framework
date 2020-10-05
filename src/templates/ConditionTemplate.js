const { extension, coding } = require('./snippets');
const { ifAllArgsObj } = require('../helpers/templateUtils');

function histologyTemplate({ histology }) {
  return {
    url: histology.url,
    valueCodeableConcept: {
      coding: [coding({
        system: histology.system,
        code: histology.code,
      }),
      ],
    },
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
      coding: [coding({
        system: clinicalStatus.system,
        code: clinicalStatus.code,
      }),
      ],
    },
  };
}

function verificationStatusTemplate({ verificationStatus }) {
  return {
    verificationStatus: {
      coding: [coding({
        system: verificationStatus.system,
        code: verificationStatus.code,
      }),
      ],
    },
  };
}

function individualCategoryTemplate(category) {
  return {
    coding: [coding({
      system: category.system,
      code: category.code,
    }),
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
      coding: [coding({
        system: code.system,
        code: code.code,
        display: code.display,
      }),
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
            valueCodeableConcept: {
              coding: [coding({
                system: laterality.system,
                code: laterality.code,
              }),
              ],
            },
          },
        ],
        coding: [coding({
          system: bodySite[0].system,
          code: bodySite[0].code,
        }),
        ],
      },
    ],
  };
}

function subjectTemplate({ mrn }) {
  return {
    subject: {
      reference: `urn:uuid:${mrn}`,
    },
  };
}

// Based on https://mcodeinitiative.github.io/StructureDefinition-obf-Condition.html
// Official url: http://hl7.org/fhir/us/mcode/StructureDefinition/obf-Condition
function conditionTemplate({
  mrn, conditionId, code, category, dateOfDiagnosis, clinicalStatus, verificationStatus, bodySite, laterality, histology,
}) {
  if (!(conditionId && mrn && code.system && code.code && category)) {
    throw Error('Trying to render a ConditionTemplate, but a required argument is missing; ensure that id, mrn, code, codesystem, and category are all present');
  }

  return {
    resourceType: 'Condition',
    id: conditionId,
    ...extension(
      ifAllArgsObj(dateOfDiagnosisTemplate)({ dateOfDiagnosis }),
      ifAllArgsObj(histologyTemplate)({ histology }),
    ),
    ...ifAllArgsObj(clinicalStatusTemplate)({ clinicalStatus }),
    ...ifAllArgsObj(verificationStatusTemplate)({ verificationStatus }),
    ...categoryArrayTemplate(category),
    ...codingTemplate({ code }),
    ...ifAllArgsObj(bodySiteTemplate)({ bodySite, laterality }),
    ...subjectTemplate({ mrn }),
  };
}

module.exports = {
  conditionTemplate,
};
