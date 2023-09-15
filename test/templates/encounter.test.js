const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const maximalEncounter = require('./fixtures/maximal-encounter-resource.json');
const minimalEncounter = require('./fixtures/minimal-encounter-resource.json');
const { encounterTemplate } = require('../../src/templates/EncounterTemplate');

describe('test Encounter template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const MAX_DATA = {
      id: 'encounterId-1',
      status: 'arrived',
      subject: {
        id: '123',
      },
      classCode: 'AMB',
      classSystem: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      typeCode: '11429006',
      typeSystem: 'http://snomed.info/sct',
      startDate: '2020-01-10',
      endDate: '2020-01-10',
    };

    const generatedEncounter = encounterTemplate(MAX_DATA);

    // Relevant fields should match the valid FHIR
    expect(generatedEncounter).toEqual(maximalEncounter);
    expect(isValidFHIR(generatedEncounter)).toBeTruthy();
  });

  test('valid data with only required attributes passed into template should generate valid FHIR resource', () => {
    const MINIMAL_DATA = {
      id: 'encounterId-1',
      status: 'arrived',
      subject: {
        id: '123',
      },
      classCode: 'AMB',
      classSystem: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    };

    const generatedEncounter = encounterTemplate(MINIMAL_DATA);

    // Relevant fields should match the valid FHIR
    expect(generatedEncounter).toEqual(minimalEncounter);
    expect(isValidFHIR(generatedEncounter)).toBeTruthy();
  });

  test('missing required data should throw an error', () => {
    const INVALID_DATA = {
      id: 'encounterId-1',
      subject: {
        id: '123',
      },
      classCode: 'AMB',
      classSystem: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      typeCode: '11429006',
      typeSystem: 'http://snomed.info/sct',
      startDate: '2020-01-10',
      endDate: '2020-01-10',
    };

    expect(() => encounterTemplate(INVALID_DATA)).toThrow(Error);
  });
});
