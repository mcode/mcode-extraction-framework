const { coding, reference, valueCodeableConcept } = require('./snippets');

// Returns category specific data based on stage and category type
function getCategorySpecificData(stageType, categoryType) {
  if (stageType === 'Clinical') {
    const categoryCode = 'survey';
    if (categoryType === 'Tumor') {
      return {
        categoryCode,
        profileUrl: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tnm-clinical-primary-tumor-category',
        code: '21905-5',
      };
    }
    if (categoryType === 'Metastases') {
      return {
        categoryCode,
        profileUrl: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tnm-clinical-distant-metastases-category',
        code: '21907-1',
      };
    }
    if (categoryType === 'Nodes') {
      return {
        categoryCode,
        profileUrl: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tnm-clinical-regional-nodes-category',
        code: '21906-3',
      };
    }
  } else if (stageType === 'Pathological') {
    const categoryCode = 'laboratory';
    if (categoryType === 'Tumor') {
      return {
        categoryCode,
        profileUrl: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tnm-pathological-primary-tumor-category',
        code: '21899-0',
      };
    }
    if (categoryType === 'Metastases') {
      return {
        categoryCode,
        profileUrl: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tnm-pathological-distant-metastases-category',
        code: '21901-4',
      };
    }
    if (categoryType === 'Nodes') {
      return {
        categoryCode,
        profileUrl: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tnm-pathological-regional-nodes-category',
        code: '21900-6',
      };
    }
  }
  throw new Error('Provided stage and category types are not valid.');
}

function tnmCategoryTemplate({
  id, subjectId, conditionId, valueCode, effectiveDateTime, categoryType, stageType,
}) {
  if (!(id && subjectId && conditionId && valueCode && effectiveDateTime && categoryType && stageType)) {
    throw Error('Trying to render a TNMCategoryTemplate, but a required argument is missing;'
      + ' ensure that id, subjectId, conditionId, valueCode, effectiveDateTime, categoryType, and stageType, are all present');
  }

  const categorySpecificData = getCategorySpecificData(stageType, categoryType);
  const { categoryCode, profileUrl, code } = categorySpecificData;

  return {
    resourceType: 'Observation',
    id,
    meta: {
      profile: [profileUrl],
    },
    status: 'final',
    category: [
      {
        coding: [
          coding({
            system:
              'http://terminology.hl7.org/CodeSystem/observation-category',
            code: categoryCode,
          }),
        ],
      },
    ],
    code: {
      coding: [
        coding({
          system: 'http://loinc.org',
          code,
        }),
      ],
    },
    subject: reference({ id: subjectId }),
    effectiveDateTime,
    ...valueCodeableConcept({ code: valueCode, system: 'http://cancerstaging.org' }),
    focus: [reference({ id: conditionId })],
  };
}

module.exports = {
  tnmCategoryTemplate,
};
