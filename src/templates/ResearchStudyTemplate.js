const { identifierArr, identifier } = require('./snippets');

function siteTemplate(clinicalSiteID, clinicalSiteSystem) {
  return {
    site: [
      {
        display: 'ID associated with Clinical Trial',
        ...identifier({
          system: clinicalSiteSystem,
          value: clinicalSiteID,
        }),
      },
    ],
  };
}

function researchStudyIdentifierTemplate(trialResearchID, trialResearchSystem) {
  return identifierArr({
    system: trialResearchSystem,
    type: {
      text: 'Clinical Trial Research ID',
    },
    value: trialResearchID,
  });
}


// Based on https://www.hl7.org/fhir/researchstudy.html
function researchStudyTemplate({
  id, trialStatus, trialResearchID, clinicalSiteID, clinicalSiteSystem, trialResearchSystem,
}) {
  if (!(id && trialStatus && trialResearchID && clinicalSiteID)) {
    throw Error('Trying to render a ResearchStudyTemplate, but a required argument is missing; ensure that id, trialStatus, trialResearchID, clinicalSiteID are all present');
  }

  return {
    resourceType: 'ResearchStudy',
    id,
    status: trialStatus,
    ...siteTemplate(clinicalSiteID, clinicalSiteSystem),
    ...researchStudyIdentifierTemplate(trialResearchID, trialResearchSystem),
  };
}

module.exports = {
  researchStudyTemplate,
};
