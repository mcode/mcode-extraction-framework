const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const maximalCancerDiseaseStatus = require('./fixtures/disease-status-resource.json');
const minimalCancerDiseaseStatus = require('./fixtures/minimal-disease-status-resource.json');
const { cancerDiseaseStatusTemplate } = require('../../src/templates/CancerDiseaseStatusTemplate');

describe('test CancerDiseaseStatus template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const MAX_DATA = {
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

    const generatedDiseaseStatus = cancerDiseaseStatusTemplate(MAX_DATA);

    // Relevant fields should match the valid FHIR
    expect(generatedDiseaseStatus).toEqual(maximalCancerDiseaseStatus);
    expect(isValidFHIR(generatedDiseaseStatus)).toBeTruthy();
  });

  test('valid data with only required attributes passed into template should generate valid FHIR resource', () => {
    const MINIMAL_DATA = {
      // Minimal amount of data to be accepted, evidence is excluded
      id: 'CancerDiseaseStatus-fixture',
      status: 'final',
      value: {
        code: '709137006',
        system: 'http://snomed.info/sct',
        display: 'undetermined',
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

    const generatedDiseaseStatus = cancerDiseaseStatusTemplate(MINIMAL_DATA);

    // Relevant fields should match the valid FHIR
    expect(generatedDiseaseStatus).toEqual(minimalCancerDiseaseStatus);
    expect(isValidFHIR(generatedDiseaseStatus)).toBeTruthy();
  });

  test('valid data where cds-status is not not-asked generates a dataAbsentReason', () => {
    const MINIMAL_DATA = {
      // Minimal amount of data to be accepted, evidence is excluded
      id: 'CancerDiseaseStatus-fixture',
      status: 'final',
      value: {
        code: 'not-asked',
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

    const generatedDiseaseStatus = cancerDiseaseStatusTemplate(MINIMAL_DATA);

    // CDS should have an extension
    expect(generatedDiseaseStatus).toHaveProperty('valueCodeableConcept.extension');
    // CDS should have an extension url of dataAbsentReason
    expect(generatedDiseaseStatus).toHaveProperty(['valueCodeableConcept', 'extension', 0, 'url'], 'http://hl7.org/fhir/StructureDefinition/data-absent-reason');
    // CDS should have an extension valueCode of not-asked
    expect(generatedDiseaseStatus).toHaveProperty(['valueCodeableConcept', 'extension', 0, 'valueCode'], 'not-asked');
    // CDS should be valid
    expect(isValidFHIR(generatedDiseaseStatus)).toBeTruthy();
  });

  test('missing required data should throw an error', () => {
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

    expect(() => cancerDiseaseStatusTemplate(INVALID_DATA)).toThrow(Error);
  });
});
