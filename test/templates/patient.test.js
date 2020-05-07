const fs = require('fs');
const path = require('path');
const validExamplePatient = require('./fixtures/patient-resource.json');
const { renderTemplate } = require('../../src/helpers/ejsUtils');

const PATIENT_VALID_DATA = {
  mrn: '1234',
  family: 'Patient',
  given: 'Test',
  gender: 'female',
};

const PATIENT_INVALID_DATA = {
  // Omitting mrn information, which is required
  family: 'Patient',
  given: 'Test',
  gender: 'female',
};

const PATIENT_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../src/templates/Patient.ejs'), 'utf8');

describe('test Patient template', () => {
  test('valid data passed into template should generate FHIR resource', () => {
    const generatedPatient = renderTemplate(
      PATIENT_TEMPLATE,
      PATIENT_VALID_DATA,
    );
    expect(generatedPatient.identifier).toEqual(validExamplePatient.identifier);
    expect(generatedPatient.name).toEqual(validExamplePatient.name);
    expect(generatedPatient.gender).toEqual(validExamplePatient.gender);
  });

  test('invalid data should thrown an error', () => {
    expect(() => renderTemplate(PATIENT_TEMPLATE, PATIENT_INVALID_DATA)).toThrow(ReferenceError);
  });
});
