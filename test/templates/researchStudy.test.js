const fs = require('fs');
const path = require('path');
const validResearchStudy = require('./fixtures/research-study-resource.json');
const { renderTemplate } = require('../../src/helpers/ejsUtils');

const VALID_DATA = {
  trialStatus: 'active',
  trialResearchID: 'AFT1235',
};

const INVALID_DATA = {
  // Omitting 'trialResearchID' field which is required
  trialStatus: 'completed',
};

const RESEARCH_STUDY_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../src/templates/ResearchStudy.ejs'), 'utf8');

describe('test ResearchStudy template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const generatedResearchStudy = renderTemplate(
      RESEARCH_STUDY_TEMPLATE,
      VALID_DATA,
    );
    // Relevant fields should match the valid FHIR
    expect(generatedResearchStudy.id).toEqual(validResearchStudy.id);
    expect(generatedResearchStudy.trialStatus).toEqual(validResearchStudy.trialStatus);
    expect(generatedResearchStudy.trialResearchID).toEqual(validResearchStudy.trialResearchID);
  });

  test('invalid data should throw an error', () => {
    expect(() => renderTemplate(
      RESEARCH_STUDY_TEMPLATE,
      INVALID_DATA,
    )).toThrow(ReferenceError);
  });
});
