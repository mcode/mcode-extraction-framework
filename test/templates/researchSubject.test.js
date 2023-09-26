const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const validResearchSubject = require('./fixtures/research-subject-resource.json');
const { researchSubjectTemplate } = require('../../src/templates/ResearchSubjectTemplate');

const VALID_DATA = {
  id: 'id-for-research-subject',
  enrollmentStatus: 'candidate',
  trialSubjectID: 'trial-123',
  trialResearchID: 'rs1',
  patientId: 'mCODEPatient1',
  startDate: '2020-01-01',
  endDate: '2021-01-01',
};

const INVALID_DATA = {
  // Omitting 'trialSubjectID' field which is required
  enrollmentStatus: 'candidate',
  trialResearchID: 'rs1',
  patientId: 'mCODEPatient1',
  trialSubjectID: null,
  startDate: '2020-01-01',
  endDate: '2021-01-01',
};

describe('test ResearchSubject template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const generatedResearchSubject = researchSubjectTemplate(VALID_DATA);
    // Relevant fields should match the valid FHIR
    expect(generatedResearchSubject.id).toEqual(validResearchSubject.id);
    expect(generatedResearchSubject.trialStatus).toEqual(validResearchSubject.trialStatus);
    expect(generatedResearchSubject.trialResearchID).toEqual(validResearchSubject.trialResearchID);
    expect(generatedResearchSubject.period.start).toEqual(validResearchSubject.period.start);
    expect(generatedResearchSubject.period.end).toEqual(validResearchSubject.period.end);
    expect(isValidFHIR(generatedResearchSubject)).toBeTruthy();
  });

  test('invalid data should throw an error', () => {
    expect(() => researchSubjectTemplate(INVALID_DATA)).toThrow(Error);
  });
});
