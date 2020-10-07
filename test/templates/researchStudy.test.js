const validResearchStudy = require('./fixtures/research-study-resource.json');
const { researchStudyTemplate } = require('../../src/templates');

const VALID_DATA = {
  id: 'id-for-research-study',
  trialStatus: 'active',
  trialResearchID: 'AFT1235',
  clinicalSiteID: 'EXAMPLE_SITE_ID',
};

const INVALID_DATA = {
  // Omitting 'trialResearchID' field which is required
  trialStatus: 'completed',
};

describe('test ResearchStudy template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const generatedResearchStudy = researchStudyTemplate(VALID_DATA);
    // Relevant fields should match the valid FHIR
    expect(generatedResearchStudy).toEqual(validResearchStudy);
  });

  test('invalid data should throw an error', () => {
    expect(() => researchStudyTemplate(INVALID_DATA)).toThrow(Error);
  });
});
