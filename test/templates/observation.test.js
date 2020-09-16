const fs = require('fs');
const path = require('path');
const maximalObservationResource = require('./fixtures/maximal-observation-resource.json');
const minimalObservationResource = require('./fixtures/minimal-observation-resource.json');
const { renderTemplate } = require('../../src/helpers/ejsUtils');

const MAXIMAL_VALID_DATA = {
  id: 'example-id',
  subject: {
    id: 'example-mrn',
  },
  status: 'final',
  code: {
    code: '8302-2',
    system: 'http://loinc.org',
    display: 'Body Height',
  },
  value: {
    code: 70,
    system: '[in_i]',
    unit: 'in',
  },
  effectiveDate: '2020-01-01',
  bodySite: {
    code: '106004',
  },
  laterality: {
    code: '51440002',
  },
  isVitalSign: true,
};

const MINIMAL_DATA = {
  // Minimal amount of data to be accepted. DisplayName, bodySite, and laterality are excluded
  id: 'example-id',
  subject: {
    id: 'example-mrn',
  },
  status: 'final',
  code: {
    code: '8302-2',
    system: 'http://loinc.org',
    display: null,
  },
  value: {
    code: 70,
    system: '[in_i]',
    unit: 'in',
  },
  effectiveDate: '2020-01-01',
  bodySite: null,
  laterality: null,
  isVitalSign: true,
};

const INVALID_DATA = {
  // Omitting id, subject, status, code, codeSystem, value, and effectiveDate fields, which are all required
  bodySite: {
    code: '251007',
  },
  laterality: {
    code: '66459002',
  },
};

const OBSERVATION_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../src/templates/Observation.ejs'), 'utf8');

describe('test Observation template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const generatedObservation = renderTemplate(
      OBSERVATION_TEMPLATE,
      MAXIMAL_VALID_DATA,
    );

    // Relevant fields should match the valid FHIR
    expect(generatedObservation).toEqual(maximalObservationResource);
  });

  test('valid data with only required attributes passed into template should generate valid FHIR resource', () => {
    const generatedObservation = renderTemplate(
      OBSERVATION_TEMPLATE,
      MINIMAL_DATA,
    );

    // Relevant fields should match the valid FHIR
    expect(generatedObservation).toEqual(minimalObservationResource);
  });

  test('invalid data should throw an error', () => {
    // ReferenceError will happen when a required field in the template is undefined
    expect(() => renderTemplate(OBSERVATION_TEMPLATE, INVALID_DATA)).toThrow(ReferenceError);
  });
});
