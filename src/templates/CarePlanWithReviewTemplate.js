const {
  coding, extensionArr, meta, narrative, reference, valueCodeableConcept, valueX,
} = require('./snippets');
const { ifAllArgs } = require('../helpers/templateUtils');

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
function carePlanReasonTemplate({ reasonCode, reasonDisplayText }) {
  return {
    url: 'CarePlanChangeReason',
    ...valueCodeableConcept({
      system: 'http://snomed.info/sct',
      code: reasonCode,
      display: reasonDisplayText,
      text: reasonDisplayText,
    }),
  };
}

function carePlanChangeReasonExtensionTemplate({ hasChanged, reasonCode, reasonDisplayText, effectiveDate }) {
  let hasChangedBoolean = hasChanged;
  if (hasChanged === 'true') {
    hasChangedBoolean = true;
  } else if (hasChanged === 'false') {
    hasChangedBoolean = false;
  }
  return {
    url: 'http://mcodeinitiative.org/codex/us/icare/StructureDefinition/icare-care-plan-review',
    extension: [
      ...((reasonCode || reasonDisplayText) ? [carePlanReasonTemplate({ reasonCode, reasonDisplayText })] : []),
      {
        url: 'ReviewDate',
        ...valueX(effectiveDate),
      },
      {
        url: 'ChangedFlag',
        ...valueX(hasChangedBoolean),
      },
    ],
  };
}

function subjectTemplate(subject) {
  return {
    subject: reference(subject),
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
  id, mrn, name, effectiveDate, effectiveDateTime, hasChanged, reasonCode, reasonDisplayText,
}) {
  if (!(id && mrn && effectiveDate && hasChanged != null)) {
    const errorMessage = 'Trying to render a CarePlanWithReviewTemplate, but a required argument was missing; '
      + 'ensure that id, mrn, effectiveDate, hasChanged are all present';
    throw new Error(errorMessage);
  }
  return {
    resourceType: 'CarePlan',
    id,
    ...metaTemplate(),
    ...textTemplate(),
    ...extensionArr(
      carePlanChangeReasonExtensionTemplate({ hasChanged, reasonCode, reasonDisplayText, effectiveDate }),
    ),
    ...subjectTemplate({ id: mrn, name }),
    status: 'draft',
    intent: 'proposal',
    ...ifAllArgs(createdTemplate)({ effectiveDateTime }),
    ...categoryTemplate(),
  };
}

module.exports = {
  carePlanWithReviewTemplate,
};
