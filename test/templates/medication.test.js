const { isValidFHIR } = require('../utils');
const maximalValidExampleMedication = require('./fixtures/maximal-medication-resource.json');
const minimalValidExampleMedication = require('./fixtures/minimal-medication-resource.json');
const { cancerRelatedMedicationTemplate } = require('../../src/templates/CancerRelatedMedicationTemplate.js');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

const MEDICATION_VALID_DATA = {
  mrn: 'mrn-1',
  id: 'medicationId-1',
  code: 'example-code',
  codeSystem: 'example-code-system',
  displayText: 'Example Text',
  startDate: '2020-01-01',
  endDate: '2020-02-01',
  treatmentReasonCode: 'example-reason',
  treatmentReasonCodeSystem: 'example-code-system',
  treatmentReasonDisplayText: 'Example Text',
  treatmentIntent: 'example-code',
  status: 'example-status',
};

const MEDICATION_MINIMAL_DATA = {
  // Only include 'mrn', 'code', 'codesystem', and 'status' fields which are required
  mrn: 'mrn-1',
  code: 'example-code',
  codeSystem: 'example-code-system',
  status: 'example-status',
  startDate: null,
  endDate: null,
  displayText: null,
  treatmentReasonCode: null,
  treatmentReasonCodeSystem: null,
  treatmentReasonDisplayText: null,
  treatmentIntent: null,
};


const MEDICATION_INVALID_DATA = {
  // Omitting 'mrn', 'code', 'codesystem', fields which are required
  mrn: null,
  code: null,
  codeSystem: null,
  status: null,
  startDate: '2020-01-01',
  endDate: '2020-02-01',
  id: 'medicationId-1',
  displayText: 'Example Text',
  treatmentReasonCode: 'example-reason',
  treatmentReasonCodeSystem: 'example-code-system',
  treatmentReasonDisplayText: 'Example Text',
  treatmentIntent: 'example-code',
};

describe('test Medication template', () => {
  test('valid data passed into template should generate FHIR resource', () => {
    const generatedMedication = cancerRelatedMedicationTemplate(MEDICATION_VALID_DATA);

    expect(generatedMedication).toEqual(maximalValidExampleMedication);
    expect(isValidFHIR(generatedMedication)).toBeTruthy();
  });

  test('minimal data passed into template should generate FHIR resource', () => {
    const generatedMedication = cancerRelatedMedicationTemplate(MEDICATION_MINIMAL_DATA);

    expect(generatedMedication).toEqual(minimalValidExampleMedication);
    expect(isValidFHIR(generatedMedication)).toBeTruthy();
  });

  test('missing non-required data should not throw an error', () => {
    const OPTIONAL_DATA = {
      displayText: 'Example Text',
      treatmentReasonCode: 'example-reason',
      treatmentReasonCodeSystem: 'example-code-system',
      treatmentReasonDisplayText: 'Example Text',
      treatmentIntent: 'example-code',
      id: 'medicationId-1',
      startDate: 'YYYY-MM-DD',
      endDate: 'YYYY-MM-DD',
    };

    const NECESSARY_DATA = {
      mrn: 'mrn-1',
      code: 'example-code',
      codeSystem: 'example-code-system',
      status: 'example-status',
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, cancerRelatedMedicationTemplate, NECESSARY_DATA);
  });

  test('invalid data should throw an error', () => {
    expect(() => cancerRelatedMedicationTemplate(MEDICATION_INVALID_DATA)).toThrow(Error);
  });
});
