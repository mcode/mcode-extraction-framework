const { coding, reference, stagingMethodTemplate, valueX } = require('./snippets');

// Returns staging specific data based whether it is clinical or pathologic
function getTypeSpecificData(type) {
  if (type === 'Clinical') {
    return {
      categoryCode: 'survey',
      code: '21908-9',
      profileUrl: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tnm-clinical-stage-group',
    };
  }

  if (type === 'Pathologic') {
    return {
      categoryCode: 'laboratory',
      code: '21902-2',
      profileUrl: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tnm-pathological-stage-group',
    };
  }

  throw new Error('Provided staging type must be "Clinical" or "Pathologic"');
}

function hasMemberTemplate(categoryIds) {
  if (!categoryIds || categoryIds.length === 0) return {};

  return {
    hasMember: categoryIds.map((id) => reference({ id, resourceType: 'Observation' })),
  };
}

function stagingTemplate({
  categoryIds,
  conditionId,
  effectiveDateTime,
  id,
  stageGroup,
  stagingSystem,
  stagingCodeSystem,
  subjectId,
  type,
}) {
  if (!(id && subjectId && conditionId && effectiveDateTime && stageGroup && type)) {
    throw Error('Trying to render a StagingTemplate, but a required argument is missing;'
      + ' ensure that id, subjectId, conditionId, effectiveDateTime, stageGroup, type, are all present');
  }

  const typeSpecificData = getTypeSpecificData(type);
  const { categoryCode, code, profileUrl } = typeSpecificData;

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
    ...stagingMethodTemplate({ code: stagingSystem, system: stagingCodeSystem }),
    subject: reference({ id: subjectId, resourceType: 'Patient' }),
    effectiveDateTime,
    ...valueX({ code: stageGroup, system: 'http://cancerstaging.org' }, 'valueCodeableConcept'),
    focus: [reference({ id: conditionId, resourceType: 'Condition' })],
    ...hasMemberTemplate(categoryIds),
  };
}

module.exports = {
  stagingTemplate,
};
