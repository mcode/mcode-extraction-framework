const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const maximalObservationResource = require('./fixtures/maximal-observation-resource.json');
const minimalObservationResource = require('./fixtures/minimal-observation-resource.json');
const { observationTemplate } = require('../../src/templates/ObservationTemplate');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

const MAXIMAL_VALID_DATA = {
  id: 'example-id',
  subjectId: 'example-mrn',
  status: 'final',
  code: '8302-2',
  system: 'http://loinc.org',
  display: 'Body Height',
  valueCode: '70 [in_i]',
  valueCodeSystem: 'http://unitsofmeasure.org',
  effectiveDateTime: '2020-01-01',
  bodySite: '106004',
  laterality: '51440002',
};

const MINIMAL_DATA = {
  // Minimal amount of data to be accepted. DisplayName, bodySite, and laterality are excluded
  id: 'example-id',
  subjectId: 'example-mrn',
  status: 'final',
  code: '8302-2',
  system: 'http://loinc.org',
  display: null,
  valueCode: '70 [in_i]',
  valueCodeSystem: null,
  effectiveDateTime: '2020-01-01',
  bodySite: null,
  laterality: null,
};

const INVALID_DATA = {
  // Omitting all required fields
  bodySite: '251007',
  laterality: '66459002',
};

describe('test Observation template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const generatedObservation = observationTemplate(MAXIMAL_VALID_DATA);

    // Relevant fields should match the valid FHIR
    expect(generatedObservation).toEqual(maximalObservationResource);
    expect(isValidFHIR(generatedObservation)).toBeTruthy();
  });

  test('valid data with only required attributes passed into template should generate valid FHIR resource', () => {
    const generatedObservation = observationTemplate(MINIMAL_DATA);


    // Relevant fields should match the valid FHIR
    expect(generatedObservation).toEqual(minimalObservationResource);
    expect(isValidFHIR(generatedObservation)).toBeTruthy();
  });

  test('missing non-required data should not throw an error', () => {
    const NECESSARY_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      status: 'final',
      code: '8302-2',
      system: 'http://loinc.org',
      valueCode: '70 [in_i]',
      effectiveDateTime: '2020-01-01',
    };

    const OPTIONAL_DATA = {
      display: 'Body Height',
      valueCodeSystem: 'http://unitsofmeasure.org',
      bodySite: '106004',
      laterality: '51440002',
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, observationTemplate, NECESSARY_DATA);
  });

  test('invalid data should throw an error', () => {
    // ReferenceError will happen when a required field in the template is undefined
    expect(() => observationTemplate(INVALID_DATA)).toThrow(Error);
  });
});
