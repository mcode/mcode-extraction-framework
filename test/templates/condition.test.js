const fs = require('fs');
const path = require('path');
const validExampleCondition = require('./fixtures/condition-resource.json');
const { renderTemplate } = require('../../src/helpers/ejsUtils');

const CONDITION_VALID_DATA = {
  id: 'example-id',
  subject: {
    id: 'example-subject-id',
  },
  code: {
    system: 'example-system',
    code: 'example-code',
    display: 'exampleDisplayName'
  },
  category: [
    {
      system: 'example-system',
      code: 'example-code',
    },
  ],
  dateOfDiagnosis: {
    value: 'YYYY-MM-DD',
    url: 'example-url',
  },
  clinicalStatus: {
    system: 'example-system',
    code: 'example-code',
  },
  verificationStatus: {
    system: 'example-system',
    code: 'example-code',
  },
  bodySite: [
    {
      system: 'example-system',
      code: 'example-code',
    },
  ],
  laterality: {
    system: 'example-system',
    code: 'example-code',
    url: 'example-url',
  },
  histology: {
    system: 'example-system',
    code: 'example-code',
    url: 'example-url',
  },
};

const CONDITION_INVALID_DATA = {
  // Omitting 'subject', 'conditionId', 'code', 'codesystem', and 'category' fields which are required
  dateOfDiagnosis: {
    value: 'YYYY-MM-DD',
    url: 'example-url',
  },
  clinicalStatus: {
    system: 'example-system',
    code: 'example-code',
  },
  verificationStatus: {
    system: 'example-system',
    code: 'example-code',
  },
  bodySite: [
    {
      system: 'example-system',
      code: 'example-code',
    },
  ],
  laterality: {
    system: 'example-system',
    code: 'example-code',
    url: 'example-url',
  },
  histology: {
    system: 'example-system',
    code: 'example-code',
    url: 'example-url',
  },
};

const CONDITION_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../src/templates/Condition.ejs'), 'utf8');

describe('test Condition template', () => {
  test('valid data passed into template should generate FHIR resource', () => {
    const generatedCondition = renderTemplate(
      CONDITION_TEMPLATE,
      CONDITION_VALID_DATA,
    );

    expect(generatedCondition).toEqual(validExampleCondition);
  });

  test('invalid data should throw an error', () => {
    expect(() => renderTemplate(CONDITION_TEMPLATE, CONDITION_INVALID_DATA)).toThrow(ReferenceError);
  });
});
