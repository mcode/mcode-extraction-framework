const fs = require('fs');
const path = require('path');
const validExampleObservation = require('./fixtures/observation-resource.json');
const { renderTemplate, applyAttributesToData } = require('../../src/helpers/ejsUtils');

const OBSERVATION_VALID_DATA = applyAttributesToData({
  id: 'CancerDiseaseStatus-fixture',
  subject: {
    id: '123-example-patient',
  },
  category: 'therapy',
  code: {
    system: 'http://loinc.org',
    code: '88040-1',
    display: 'Response to cancer treatment',
  },
  value: {
    code: '385633008',
    system: 'http://snomed.info/sct',
    display: 'Improving',
  },
  condition: {
    id: '123-Walking-Corpse-Syndrome',
    name: 'Walking Corpse Syndrome',
  },
  effectiveDate: '1994-12-09T09:07:00Z',
}, 'Observation');

const OBSERVTION_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../src/templates/Observation.ejs'), 'utf8');

describe('test Observation template', () => {
  test('valid data passed into template should generate FHIR resource', () => {
    const generatedObservation = renderTemplate(
      OBSERVTION_TEMPLATE,
      OBSERVATION_VALID_DATA,
    );

    expect(generatedObservation).toEqual(validExampleObservation);
  });
});
