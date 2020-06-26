const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const BODY_SITE_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../../src/templates/helpers/bodySite.ejs'), 'utf8');
const BODY_SITE_GOOD = { bodySite: [{ coding: [{ code: 'SomeValue', codeSystem: 'http://snomed.info/sct' }] }] };
const BODY_LATERALITY_GOOD = { bodySite: [
  { extension: [
    {
      url: 'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-laterality',
      valueCodeableConcept: {
        code: 'latValue',
        codeSystem: 'http://snomed.info/sct',
      },
    },
  ],
  coding: [
    { code: 'SomeValue', codeSystem: 'http://snomed.info/sct' },
  ] },
] };
describe('test bodySite template', () => {
  test('null data passed into template should generate empty string', () => {
    const generated = ejs.render(
      BODY_SITE_TEMPLATE,
      null,
    );

    // Relevant fields should match the valid FHIR
    expect(generated).toEqual('');
  });

  test('supplying just laterality will produce empty string', () => {
    const generated = ejs.render(
      BODY_SITE_TEMPLATE,
      { laterality: 'someValue' },
    );

    // Relevant fields should match the valid FHIR
    expect(generated).toEqual('');
  });

  test('supplying a valid body site should produce valid output', () => {
    const generated = `{${ejs.render(
      BODY_SITE_TEMPLATE,
      { bodySite: 'SomeValue' },
    )}}`;

    // Relevant fields should match the valid FHIR
    expect(JSON.parse(generated)).toEqual(BODY_SITE_GOOD);
  });

  test('supplying a valid bodySite and laterality should produce valid output', () => {
    const generated = `{${ejs.render(
      BODY_SITE_TEMPLATE,
      { bodySite: 'SomeValue', laterality: 'latValue' },
    )}}`;

    // Relevant fields should match the valid FHIR
    expect(JSON.parse(generated)).toEqual(BODY_LATERALITY_GOOD);
  });
});
