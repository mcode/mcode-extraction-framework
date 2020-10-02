const validCancerDiseaseStatus = require('./fixtures/disease-status-resource.json');
const minimalCancerDiseaseStatus = require('./fixtures/minimal-disease-status-resource.json');
const { cancerDiseaseStatusTemplate } = require('../../src/templates/CancerDiseaseStatusTemplate');

const VALID_DATA = {
  id: 'CancerDiseaseStatus-fixture',
  status: 'final',
  value: {
    code: '385633008',
    system: 'http://snomed.info/sct',
    display: 'Improving',
  },
  subject: {
    id: '123-example-patient',
    name: 'Mr. Patient Example',
  },
  condition: {
    id: '123-Walking-Corpse-Syndrome',
    name: 'Walking Corpse Syndrome',
  },
  effectiveDateTime: '1994-12-09T09:07:00Z',
  evidence: [
    {
      code: '09870987',
      display: 'Evidence display text',
    },
    {
      code: '12341234',
    },
  ],
};

const MINIMAL_DATA = {
  // Minimal amount of data to be accepted, evience is excluded
  id: 'CancerDiseaseStatus-fixture',
  status: 'final',
  value: {
    code: '385633008',
    system: 'http://snomed.info/sct',
    display: 'Improving',
  },
  subject: {
    id: '123-example-patient',
    name: 'Mr. Patient Example',
  },
  condition: {
    id: '123-Walking-Corpse-Syndrome',
    name: 'Walking Corpse Syndrome',
  },
  effectiveDateTime: '1994-12-09T09:07:00Z',
  evidence: null,
};

const INVALID_DATA = {
  id: 'CancerDiseaseStatus-fixture',
  // Omitting 'status' field which is required
  value: {
    code: '385633008',
    system: 'http://snomed.info/sct',
    display: 'Improving',
  },
  subject: {
    id: '123-example-patient',
    name: 'Mr. Patient Example',
  },
  condition: {
    id: '123-Walking-Corpse-Syndrome',
    name: 'Walking Corpse Syndrome',
  },
  effectiveDateTime: '1994-12-09T09:07:00Z',
  evidence: null,
};

describe('test CancerDiseaseStatus template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const generatedDiseaseStatus = cancerDiseaseStatusTemplate(VALID_DATA);

    // Relevant fields should match the valid FHIR
    expect(generatedDiseaseStatus).toEqual(validCancerDiseaseStatus);
  });

  test('valid data with only required attributes passed into template should generate valid FHIR resource', () => {
    const generatedDiseaseStatus = cancerDiseaseStatusTemplate(MINIMAL_DATA);

    // Relevant fields should match the valid FHIR
    expect(generatedDiseaseStatus).toEqual(minimalCancerDiseaseStatus);
  });

  test('invalid data should throw an error', () => {
    // ReferenceError will happen when a required field in the template is undefined
    expect(() => cancerDiseaseStatusTemplate(INVALID_DATA)).toThrow(Error);
  });
});
