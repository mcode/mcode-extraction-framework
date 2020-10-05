const {
  coding, extension, meta, narrative, valueX,
} = require('./snippets');

function metaTemplate() {
  return {
    ...meta(['http://mcodeinitiative.org/codex/us/icare/StructureDefinition/icare-care-plan-with-review']),
  };
}

function textTemplate() {
  const carePlanDiv = '<div xmlns="http://www.w3.org/1999/xhtml">This resource details the Treatment Plan Changes for a particular patient over a period of time, '
  + 'as modeled in the ICAREdata usecase of mCODE. It is based on the profile found here: http://standardhealthrecord.org/guides/icare/StructureDefinition-icare-CarePlanWithReview.html</div>';
  return {
    text: narrative('additional', carePlanDiv),
  };
}

function createdTemplate({ effectiveDateTime }) {
  return {
    created: effectiveDateTime,
  };
}

// R4 change reasons valueset: http://standardhealthrecord.org/guides/icare/ValueSet-icare-care-plan-change-reason-vs.html
function carePlanReasonTemplate({ reason }) {
  return {
    url: 'CarePlanChangeReason',
    valueCodeableConcept: {
      coding: [
        coding({
          system: 'http://snomed.info/sct',
          code: reason.code,
          display: reason.displayText,
        }),
      ],
      ...(reason.displayText && { text: reason.displayText }),
    },
  };
}

function carePlanChangeReasonExtensionTemplate({ treatmentPlanChange, effectiveDate }) {
  const { reason, hasChanged } = treatmentPlanChange;
  return {
    url: 'http://mcodeinitiative.org/codex/us/icare/StructureDefinition/icare-care-plan-review',
    extension: [
      ...(reason ? [carePlanReasonTemplate({ reason })] : []),
      {
        url: 'ReviewDate',
        ...valueX(effectiveDate),
      },
      {
        url: 'ChangedFlag',
        ...valueX(hasChanged === 'true'),
      },
    ],
  };
}

function subjectTemplate({ id, name }) {
  return {
    subject: {
      reference: `urn:uuid:${id}`,
      ...(name && { display: name }),
    },
  };
}

function categoryTemplate() {
  return {
    category: [
      {
        coding: [
          coding({
            code: 'assess-plan',
            system: 'http://argonaut.hl7.org',
          }),
        ],
      },
    ],
  };
}

// Treatment Plan Change modeled with CarePlanWithReview Template
// Uses the ICARE R4 Care Plan profile which is not published yet
// For reference, ICARE R4 Care Plan profile: http://standardhealthrecord.org/guides/icare/StructureDefinition-icare-care-plan-with-review.html
function carePlanWithReviewTemplate({
  id, effectiveDateTime, effectiveDate, treatmentPlanChange, subject,
}) {
  if (!(subject && subject.id && effectiveDate && effectiveDateTime && treatmentPlanChange && treatmentPlanChange.hasChanged)) {
    const errorMessage = 'Trying to render a CarePlanWithReviewTemplate, but a required argument was missing; '
      + 'ensure that subject.id, effectiveDate, effectiveDateTime, treatmentPlanChange.hasChanged are all present';
    throw new Error(errorMessage);
  }
  return {
    resourceType: 'CarePlan',
    id,
    ...metaTemplate(),
    ...textTemplate(),
    ...extension(
      carePlanChangeReasonExtensionTemplate({ treatmentPlanChange, effectiveDate }),
    ),
    ...subjectTemplate({ id: subject.id, name: subject.name }),
    status: 'draft',
    intent: 'proposal',
    ...createdTemplate({ effectiveDateTime }),
    ...categoryTemplate(),
  };
}

module.exports = {
  carePlanWithReviewTemplate,
};
