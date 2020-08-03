const fs = require('fs');
const path = require('path');
const basicPatient = require('./fixtures/patient-resource.json');
const maximalPatient = require('./fixtures/maximal-patient-resource.json');
const { renderTemplate } = require('../../src/helpers/ejsUtils');

const PATIENT_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../src/templates/Patient.ejs'), 'utf8');


describe('Patient EJS', () => {
  test('minimal required data passed into template should generate FHIR resource', () => {
    const PATIENT_VALID_DATA = {
      id: 'Some Id',
      mrn: '1234',
      family: 'Patient',
      given: 'Test',
      gender: 'female',
    };
    const generatedPatient = renderTemplate(
      PATIENT_TEMPLATE,
      PATIENT_VALID_DATA,
    );
    expect(generatedPatient).toEqual(basicPatient);
  });
  test('maximal data passed into template should generate FHIR resource', () => {
    const MAX_PATIENT_DATA = {
      id: 'Some Id',
      mrn: '1234',
      family: 'Patient',
      given: 'Test',
      gender: 'female',
      dateOfBirth: '2001-02-06',
      language: 'en',
      address: '57 Adams St',
      city: 'New Rochelle',
      state: 'NY',
      zip: '10801',
      raceCodesystem: 'http://some.codesystem.com',
      raceCode: '29178',
      raceText: 'Some Race',
      ethnicityCode: '90210',
      ethnicityText: 'Some Ethnicity',
    };

    const generatedPatient = renderTemplate(
      PATIENT_TEMPLATE,
      MAX_PATIENT_DATA,
    );

    console.log(JSON.stringify(generatedPatient));
    expect(generatedPatient).toEqual(maximalPatient);
  });
  test('missing non-required data should not throw an error', () => {
    const NECESSARY_DATA = {
      id: 'Some Id',
      mrn: '1234',
      family: 'Patient',
      given: 'Test',
      gender: 'female',
    };
    const OPTIONAL_DATA = {
      dateOfBirth: '2001-02-06',
      language: 'en',
      address: '57 Adams St',
      city: 'New Rochelle',
      state: 'NY',
      zip: '10801',
      raceCodesystem: 'http://some.codesystem.com',
      raceCode: '29178',
      raceText: 'Some Race',
      ethnicityCode: '90210',
      ethnicityText: 'Some Ethnicity',
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(OPTIONAL_DATA)) {
      const patientData = {
        ...NECESSARY_DATA,
        ...OPTIONAL_DATA,
      };
      delete patientData[key];
      expect(() => renderTemplate(PATIENT_TEMPLATE, patientData)).not.toThrow();
    }
  });
  test('missing required data should thrown an error', () => {
    const PATIENT_INVALID_DATA = {
      // Omitting mrn information, which is required
      family: 'Patient',
      given: 'Test',
      gender: 'female',
    };

    expect(() => renderTemplate(PATIENT_TEMPLATE, PATIENT_INVALID_DATA)).toThrow(ReferenceError);
  });
});
