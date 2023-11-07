const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const maximalValidExampleRequest = require('./fixtures/maximal-medication-request.json');
const minimalValidExampleRequest = require('./fixtures/minimal-medication-request.json');
const { cancerRelatedMedicationRequestTemplate } = require('../../src/templates/CancerRelatedMedicationRequestTemplate.js');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

const REQUEST_VALID_DATA = {
  subjectId: 'mrn-1',
  id: 'medicationId-1',
  code: 'example-code',
  codeSystem: 'example-code-system',
  displayText: 'Example Text',
  authoredOn: '2020-01-01',
  treatmentReasonCode: 'example-reason',
  treatmentReasonCodeSystem: 'example-code-system',
  treatmentReasonDisplayText: 'Example Text',
  procedureIntent: 'example-code',
  status: 'example-status',
  requesterId: 'example-requester',
  intent: 'example-intent',
  dosageRoute: 'example-route',
  asNeededCode: 'example-asneeded',
  doseRateType: 'example-type',
  doseQuantityValue: '111',
  doseQuantityUnit: 'example-unit',
};

const REQUEST_MINIMAL_DATA = {
  subjectId: 'mrn-1',
  code: 'example-code',
  codeSystem: 'example-code-system',
  displayText: null,
  authoredOn: null,
  treatmentReasonCode: null,
  treatmentReasonCodeSystem: null,
  treatmentReasonDisplayText: null,
  procedureIntent: null,
  status: 'example-status',
  requesterId: 'example-requester',
  intent: 'example-intent',
  dosageRoute: null,
  asNeededCode: null,
  doseRateType: null,
  doseQuantityValue: null,
  doseQuantityUnit: null,
};


const REQUEST_INVALID_DATA = {
  subjectId: null,
  id: 'medicationId-1',
  code: null,
  codeSystem: null,
  displayText: 'Example Text',
  authoredOn: '2020-01-01',
  treatmentReasonCode: 'example-reason',
  treatmentReasonCodeSystem: 'example-code-system',
  treatmentReasonDisplayText: 'Example Text',
  procedureIntent: 'example-code',
  status: null,
  requesterId: 'example-requester',
  intent: 'example-intent',
  dosageRoute: 'example-route',
  asNeededCode: 'example-asneeded',
  doseRateType: 'example-type',
  doseQuantityValue: '111',
  doseQuantityUnit: 'example-unit',
};

describe('test Medication Request template', () => {
  test('valid data passed into template should generate FHIR resource', () => {
    const generatedRequest = cancerRelatedMedicationRequestTemplate(REQUEST_VALID_DATA);

    expect(generatedRequest).toEqual(maximalValidExampleRequest);
    expect(isValidFHIR(generatedRequest)).toBeTruthy();
  });

  test('minimal data passed into template should generate FHIR resource', () => {
    const generatedRequest = cancerRelatedMedicationRequestTemplate(REQUEST_MINIMAL_DATA);

    expect(generatedRequest).toEqual(minimalValidExampleRequest);

    expect(isValidFHIR(generatedRequest)).toBeTruthy();
  });

  test('missing non-required data should not throw an error', () => {
    const OPTIONAL_DATA = {
      id: 'medicationId-1',
      displayText: 'Example Text',
      treatmentReasonCode: 'example-reason',
      treatmentReasonCodeSystem: 'example-code-system',
      treatmentReasonDisplayText: 'Example Text',
      procedureIntent: 'example-code',
      dosageRoute: 'example-route',
      asNeededCode: 'example-asneeded',
      doseRateType: 'example-type',
      doseQuantityValue: '111',
      doseQuantityUnit: 'example-unit',
    };

    const NECESSARY_DATA = {
      subjectId: 'mrn-1',
      code: 'example-code',
      codeSystem: 'example-code-system',
      status: 'example-status',
      requesterId: 'example-requester',
      intent: 'example-intent',
      authoredOn: '2020-01-01',
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, cancerRelatedMedicationRequestTemplate, NECESSARY_DATA);
  });

  test('invalid data should throw an error', () => {
    expect(() => cancerRelatedMedicationRequestTemplate(REQUEST_INVALID_DATA)).toThrow(Error);
  });
});
