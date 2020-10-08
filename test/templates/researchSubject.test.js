const validResearchSubject = require('./fixtures/research-subject-resource.json');
const { researchSubjectTemplate } = require('../../src/templates');

const VALID_DATA = {
  id: 'id-for-research-subject',
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

describe('test ResearchSubject template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const generatedResearchSubject = researchSubjectTemplate(VALID_DATA);
    // Relevant fields should match the valid FHIR
    expect(generatedResearchSubject.id).toEqual(validResearchSubject.id);
    expect(generatedResearchSubject.trialStatus).toEqual(validResearchSubject.trialStatus);
    expect(generatedResearchSubject.trialResearchID).toEqual(validResearchSubject.trialResearchID);
  });

  test('invalid data should throw an error', () => {
    expect(() => researchSubjectTemplate(INVALID_DATA)).toThrow(Error);
  });
});
