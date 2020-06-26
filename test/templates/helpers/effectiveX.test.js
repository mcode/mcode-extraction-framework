const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const EFFECTIVE_X_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../../src/templates/helpers/effectiveX.ejs'), 'utf8');
const EFFECTIVE_DATE_TIME = { effectiveDateTime: 'June 30' };
const EFFECTIVE_PERIOD = { effectivePeriod: {
  high: 'June 30',
  low: 'June 1',
} };

describe('test effectiveX template', () => {
  test('null data passed into template should generate empty string', () => {
    const generated = ejs.render(
      EFFECTIVE_X_TEMPLATE,
      null,
    );

    // Relevant fields should match the valid FHIR
    expect(generated).toEqual('');
  });

  test('supplying string value should result in effectiveDateTime entry', () => {
    const generated = `{${ejs.render(
      EFFECTIVE_X_TEMPLATE,
      { effective: 'June 30' },
    )}}`;

    // Relevant fields should match the valid FHIR
    expect(JSON.parse(generated)).toEqual(EFFECTIVE_DATE_TIME);
  });

  test('supplying an object with high and low should result in effectivePeriod', () => {
    const generated = `{${ejs.render(
      EFFECTIVE_X_TEMPLATE,
      { effective: { high: 'June 30', low: 'June 1' } },
    )}}`;

    // Relevant fields should match the valid FHIR
    expect(JSON.parse(generated)).toEqual(EFFECTIVE_PERIOD);
  });
});
