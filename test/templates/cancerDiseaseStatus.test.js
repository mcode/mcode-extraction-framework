const fs = require('fs');
const path = require('path');
const validCancerDiseaseStatus = require('./fixtures/disease-status-resource.json');
const { renderTemplate } = require('../../src/helpers/ejsUtils');

const VALID_DATA = {
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
};

const INVALID_DATA = {
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
};

const DISEASE_STATUS_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../src/templates/CancerDiseaseStatus.ejs'), 'utf8');

describe('test CancerDiseaseStatus template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const generatedDiseaseStatus = renderTemplate(
      DISEASE_STATUS_TEMPLATE,
      VALID_DATA,
    );

    // Relevant fields should match the valid FHIR
    expect(generatedDiseaseStatus.valueCodeableConcept)
      .toEqual(validCancerDiseaseStatus.valueCodeableConcept);
    expect(generatedDiseaseStatus.status).toEqual(validCancerDiseaseStatus.status);
    expect(generatedDiseaseStatus.subject).toEqual(validCancerDiseaseStatus.subject);
  });

  test('invalid data should throw an error', () => {
    // ReferenceError will happen when a required field in the template is undefined
    expect(() => renderTemplate(DISEASE_STATUS_TEMPLATE, INVALID_DATA)).toThrow(ReferenceError);
  });
});
