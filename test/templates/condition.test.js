const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const maximalValidExampleCondition = require('./fixtures/maximal-condition-resource.json');
const minimalValidExampleCondition = require('./fixtures/minimal-condition-resource.json');
const { conditionTemplate } = require('../../src/templates/ConditionTemplate');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

const CONDITION_VALID_DATA = {
  id: 'example-id',
  subject: {
    id: 'example-subject-id',
  },
  code: {
    system: 'example-system',
    code: 'example-code',
    display: 'exampleDisplayName',
  },
  category: [
    'example-code',
  ],
  dateOfDiagnosis: '2020-01-01',
  clinicalStatus: 'example-code',
  verificationStatus: 'example-code',
  bodySite: [
    'example-code',
  ],
  laterality: 'example-code',
  histology: 'example-code',
};

const CONDITION_MINIMAL_DATA = {
  // Only include 'subject', 'conditionId', 'code', 'codesystem', and 'category' fields which are required
  id: 'example-id',
  subject: {
    id: 'example-subject-id',
  },
  code: {
    system: 'example-system',
    code: 'example-code',
  },
  category: [
    'example-code',
  ],
  dateOfDiagnosis: null,
  clinicalStatus: null,
  verificationStatus: null,
  bodySite: null,
  laterality: null,
  histology: null,
};


const CONDITION_INVALID_DATA = {
  // Omitting 'subject', 'conditionId', 'code', 'codesystem', and 'category' fields which are required
  id: null,
  subject: null,
  code: null,
  category: null,
  dateOfDiagnosis: '2020-01-01',
  clinicalStatus: 'example-code',
  verificationStatus: 'example-code',
  bodySite: [
    'example-code',
  ],
  laterality: 'example-code',
  histology: 'example-code',
};

describe('test Condition template', () => {
  test('valid data passed into template should generate FHIR resource', () => {
    const generatedCondition = conditionTemplate(CONDITION_VALID_DATA);

    expect(generatedCondition).toEqual(maximalValidExampleCondition);
    expect(isValidFHIR(generatedCondition)).toBeTruthy();
  });

  test('minimal data passed into template should generate FHIR resource', () => {
    const generatedCondition = conditionTemplate(CONDITION_MINIMAL_DATA);

    expect(generatedCondition).toEqual(minimalValidExampleCondition);
    expect(isValidFHIR(generatedCondition)).toBeTruthy();
  });

  test('missing non-required data should not throw an error', () => {
    const OPTIONAL_DATA = {
      dateOfDiagnosis: 'YYYY-MM-DD',
      clinicalStatus: 'example-code',
      verificationStatus: 'example-code',
      bodySite: [
        'example-code',
      ],
      laterality: 'example-code',
      histology: 'example-code',
    };

    const NECESSARY_DATA = {
      id: 'example-id',
      subject: {
        id: 'example-subject-id',
      },
      code: {
        system: 'example-system',
        code: 'example-code',
        display: 'exampleDisplayName',
      },
      category: [
        'example-code',
      ],
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, conditionTemplate, NECESSARY_DATA);
  });

  test('invalid data should throw an error', () => {
    expect(() => conditionTemplate(CONDITION_INVALID_DATA)).toThrow(Error);
  });
});
