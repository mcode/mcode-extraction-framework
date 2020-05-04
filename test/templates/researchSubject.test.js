const fs = require('fs');
const path = require('path');
const validResearchSubject = require('./fixtures/research-subject-resource.json');
const { renderTemplate } = require('../../src/helpers/ejsUtils');

const VALID_DATA = {
  enrollmentStatus: 'candidate',
  trialSubjectID: 'trial-123',
  trialResearchID: 'rs1',
  patientId: 'mCODEPatient1',
};

const INVALID_DATA = {
  // Omitting 'trialSubjectID' field which is required
  enrollmentStatus: 'candidate',
  trialResearchID: 'rs1',
  patientId: 'mCODEPatient1',
};

const RESEARCH_SUBJECT_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../src/templates/ResearchSubject.ejs'), 'utf8');

describe('test ResearchSubject template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const generatedResearchSubject = renderTemplate(
      RESEARCH_SUBJECT_TEMPLATE,
      VALID_DATA,
    );
    // Relevant fields should match the valid FHIR
    expect(generatedResearchSubject.id).toEqual(validResearchSubject.id);
    expect(generatedResearchSubject.trialStatus).toEqual(validResearchSubject.trialStatus);
    expect(generatedResearchSubject.trialResearchID).toEqual(validResearchSubject.trialResearchID);
  });

  test('invalid data should throw an error', () => {
    expect(() => renderTemplate(
      RESEARCH_SUBJECT_TEMPLATE,
      INVALID_DATA,
    )).toThrow(ReferenceError);
  });
});
