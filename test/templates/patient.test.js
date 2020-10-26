const { isValidFHIR } = require('../utils');
const basicPatient = require('./fixtures/patient-resource.json');
const maximalPatient = require('./fixtures/maximal-patient-resource.json');
const { patientTemplate } = require('../../src/templates/PatientTemplate');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

describe('JavaScript Render Patient', () => {
  test('minimal required data passed into template should generate FHIR resource', () => {
    const PATIENT_VALID_DATA = {
      id: 'SomeId',
      mrn: '1234',
      familyName: 'Patient',
      givenName: 'Test',
      gender: 'female',
    };
    const generatedPatient = patientTemplate(PATIENT_VALID_DATA);
    expect(generatedPatient).toEqual(basicPatient);
    expect(isValidFHIR(generatedPatient)).toBeTruthy();
  });

  test('maximal data passed into template should generate FHIR resource', () => {
    const MAX_PATIENT_DATA = {
      id: 'SomeId',
      mrn: '1234',
      familyName: 'Patient',
      givenName: 'Test',
      gender: 'female',
      birthsex: 'female',
      dateOfBirth: '2001-02-06',
      language: 'en',
      addressLine: '57 Adams St',
      city: 'New Rochelle',
      state: 'NY',
      zip: '10801',
      raceCodesystem: 'http://some.codesystem.com',
      raceCode: '29178',
      raceText: 'Some Race',
      ethnicityCode: '90210',
      ethnicityText: 'Some Ethnicity',
    };

    const generatedPatient = patientTemplate(MAX_PATIENT_DATA);

    expect(generatedPatient).toEqual(maximalPatient);
    expect(isValidFHIR(generatedPatient)).toBeTruthy();
  });

  test('missing non-required data should not throw an error', () => {
    const NECESSARY_DATA = {
      id: 'Some Id',
      mrn: '1234',
      familyName: 'Patient',
      givenName: 'Test',
      gender: 'female',
    };

    const OPTIONAL_DATA = {
      dateOfBirth: '2001-02-06',
      language: 'en',
      addressLine: '57 Adams St',
      city: 'New Rochelle',
      state: 'NY',
      zip: '10801',
      raceCodesystem: 'http://some.codesystem.com',
      raceCode: '29178',
      raceText: 'Some Race',
      ethnicityCode: '90210',
      ethnicityText: 'Some Ethnicity',
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, patientTemplate, NECESSARY_DATA);
  });

  test('missing required data should thrown an error', () => {
    const PATIENT_INVALID_DATA = {
      // Omitting mrn information, which is required
      familyName: 'Patient',
      givenName: 'Test',
      gender: 'female',
    };

    expect(() => patientTemplate(PATIENT_INVALID_DATA)).toThrow(Error);
  });
});
