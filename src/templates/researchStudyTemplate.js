
function siteTemplate(clinicalSiteID) {
  return {
    site: [
      {
        display: 'ID associated with Clinical Trial',
        identifier: {
          system: 'http://example.com/clinicalSiteIds',
          value: clinicalSiteID,
        },
      },
    ],
  };
}

// Based on https://www.hl7.org/fhir/researchstudy.html
function researchStudyTemplate({ id, trialStatus, trialResearchID, clinicalSiteID }) {
  if (!(id && trialStatus && trialResearchID && clinicalSiteID)) {
    throw Error('Trying to render a ResearchStudyTemplate, but a required argument is missing; ensure that id, trialStatus, trialResearchID, clinicalSiteID are all present');
  }

  return {
    resourceType: 'ResearchStudy',
    id,
    status: trialStatus,
    ...siteTemplate(clinicalSiteID),
    identifier: [
      {
        system: 'http://example.com/clinicaltrialids',
        type: {
          text: 'Clinical Trial Research ID',
        },
        value: trialResearchID,
      },
    ],
  };
}

module.exports = {
  researchStudyTemplate,
};
