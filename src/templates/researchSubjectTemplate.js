const { reference, identifier, identifierArr } = require('./snippets');

function studyTemplate(trialResearchID) {
  return {
    study: {
      identifier: identifier({
        system: 'http://example.com/clinicaltrialids',
        value: trialResearchID,
      }),
    },
  };
}

function individualTemplate(patientId) {
  return {
    individual: {
      ...reference({ id: patientId }),
    },
  };
}

function researchSubjectIdentifiersTemplate(trialSubjectID) {
  return identifierArr(
    {
      system: 'http://example.com/clinicaltrialsubjectids',
      type: {
        text: 'Clinical Trial Subject ID',
      },
      value: trialSubjectID,
    },
  );
}

function researchSubjectTemplate({
  id,
  enrollmentStatus,
  trialSubjectID,
  trialResearchID,
  patientId,
}) {
  if (!(id && enrollmentStatus && trialSubjectID && trialResearchID && patientId)) {
    throw Error('Trying to render a ResearchStudyTemplate, but a required argument is missing; ensure that id, trialStatus, trialResearchID, clinicalSiteID are all present');
  }

  return {
    resourceType: 'ResearchSubject',
    id,
    status: enrollmentStatus,
    ...studyTemplate(trialResearchID),
    ...individualTemplate(patientId),
    ...researchSubjectIdentifiersTemplate(trialSubjectID),
  };
}

module.exports = {
  researchSubjectTemplate,
};
