const { reference, identifier, identifierArr } = require('./snippets');
const { ifSomeArgsObj } = require('../helpers/templateUtils');

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

function periodTemplate({ startDate, endDate }) {
  return {
    period: {
      ...(startDate && { start: startDate }),
      ...(endDate && { end: endDate }),
    },
  };
}

function researchSubjectTemplate({
  id,
  enrollmentStatus,
  trialSubjectID,
  trialResearchID,
  patientId,
  trialResearchSystem,
  startDate,
  endDate,
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
    ...ifSomeArgsObj(periodTemplate)({ startDate, endDate }),
  };
}

module.exports = {
  researchSubjectTemplate,
};
