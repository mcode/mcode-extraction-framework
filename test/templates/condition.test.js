const fs = require('fs');
const path = require('path');
const validExampleCondition = require('./fixtures/condition-resource.json');
const { renderTemplate } = require('../../src/helpers/ejsUtils');

const CONDITION_VALID_DATA = {
  id: 'example-id',
  subject: {
    id: 'example-subject-id',
  },
  codes: [{
    system: 'example-system',
    code: 'example-code',
  }],
};

const CONDITION_INVALID_DATA = {
  // Omitting 'subject' field which is required
  id: 'example-id',
  codes: [{
    system: 'example-system',
    code: 'example-code',
  }],
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
