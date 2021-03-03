const { reference, identifier, identifierArr } = require('./snippets');

function studyTemplate(trialResearchID, trialResearchSystem) {
  return {
    study: {
      ...identifier({
        system: trialResearchSystem,
        value: trialResearchID,
      }),
    },
  };
}

function individualTemplate(patientId) {
  return {
    individual: {
      ...reference({ id: patientId, resourceType: 'Patient' }),
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
  trialResearchSystem,
}) {
  if (!(id && enrollmentStatus && trialSubjectID && trialResearchID && patientId)) {
    throw Error('Trying to render a ResearchStudyTemplate, but a required argument is missing; ensure that id, trialStatus, trialResearchID, clinicalSiteID are all present');
  }

  return {
    resourceType: 'ResearchSubject',
    id,
    status: enrollmentStatus,
    ...studyTemplate(trialResearchID, trialResearchSystem),
    ...individualTemplate(patientId),
    ...researchSubjectIdentifiersTemplate(trialSubjectID),
  };
}

module.exports = {
  researchSubjectTemplate,
};
