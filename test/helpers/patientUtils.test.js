const _ = require('lodash');
const shajs = require('sha.js');
const {
  getEthnicityDisplay, getRaceCodesystem, getRaceDisplay, getPatientName, maskPatientData, maskMRN,
} = require('../../src/helpers/patientUtils');
const examplePatient = require('../extractors/fixtures/csv-patient-bundle.json');
const exampleMaskedPatient = require('./fixtures/masked-patient-bundle.json');
const exampleBundleWithMRN = require('./fixtures/bundle-with-mrn-id.json');

describe('PatientUtils', () => {
  describe('getEthnicityDisplay', () => {
    // Based on the OMB Ethnicity table found here:http://hl7.org/fhir/us/core/STU3.1/ValueSet-omb-ethnicity-category.html
    const ethnicityCodeToDisplay = {
      '2135-2': 'Hispanic or Latino',
      '2186-5': 'Non Hispanic or Latino',
    };
    test('no code should return undefined', () => {
      expect(getEthnicityDisplay()).toBeUndefined();
    });
    test('invalid codes should return undefined', () => {
      const invalidCode = 'anything';
      expect(getEthnicityDisplay(invalidCode)).toBeUndefined();
    });
    test('Valid codes should return a recognizable string ', () => {
      const validEthnicityCode = Object.keys(ethnicityCodeToDisplay)[0];
      const expectedEthnicityDisplay = ethnicityCodeToDisplay[validEthnicityCode];
      expect(getEthnicityDisplay(validEthnicityCode)).toBe(expectedEthnicityDisplay);
    });
  });
  describe('getRaceCodesystem', () => {
    // Based on the OMB Race table found here: http://hl7.org/fhir/us/core/STU3.1/ValueSet-omb-race-category.html
    const raceCodeToCodesystem = {
      '1002-5': 'urn:oid:2.16.840.1.113883.6.238',
      '2028-9': 'urn:oid:2.16.840.1.113883.6.238',
      '2054-5': 'urn:oid:2.16.840.1.113883.6.238',
      '2076-8': 'urn:oid:2.16.840.1.113883.6.238',
      '2106-3': 'urn:oid:2.16.840.1.113883.6.238',
      UNK: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
      ASKU: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
    };
    test('no code should return undefined', () => {
      expect(getRaceCodesystem()).toBeUndefined();
    });
    test('invalid codes should return undefined', () => {
      const invalidCode = 'anything';
      expect(getRaceCodesystem(invalidCode)).toBeUndefined();
    });
    test('Valid codes should return a recognizable race codesystem ', () => {
      const validRaceCode = Object.keys(raceCodeToCodesystem)[0];
      const expectedCodeSystem = raceCodeToCodesystem[validRaceCode];
      expect(getRaceCodesystem(validRaceCode)).toBe(expectedCodeSystem);
    });
  });
  describe('getRaceDisplay', () => {
    // Based on the OMB Race table found here: http://hl7.org/fhir/us/core/STU3.1/ValueSet-omb-race-category.html
    const raceCodeToDisplay = {
      '1002-5': 'American Indian or Alaska Native',
      '2028-9': 'Asian',
      '2054-5': 'Black or African American',
      '2076-8': 'Native Hawaiian or Other Pacific Islander',
      '2106-3': 'White',
      UNK: 'Unknown Description: A proper value is applicable, but not known',
      ASKU: 'Asked but no answer',
    };
    test('no code should return undefined', () => {
      expect(getRaceDisplay()).toBeUndefined();
    });
    test('invalid codes should return undefined', () => {
      const invalidCode = 'anything';
      expect(getRaceDisplay(invalidCode)).toBeUndefined();
    });
    test('Valid codes should return a recognizable race display', () => {
      const validRaceCode = Object.keys(raceCodeToDisplay)[0];
      const validRaceDisplay = raceCodeToDisplay[validRaceCode];
      expect(getRaceDisplay(validRaceCode)).toBe(validRaceDisplay);
    });
  });
  describe('getPatientName', () => {
    test('valid FHIR name object is concatenated', () => {
      const name = [{
        given: ['Peter', 'Christen'],
        family: 'Asbjørnsen',
      }];
      const expectedConcatenatedName = 'Peter Christen Asbjørnsen';
      expect(getPatientName(name)).toBe(expectedConcatenatedName);
    });
  });
  describe('maskPatientData', () => {
    test('bundle should remain the same if no fields are specified to be masked', () => {
      const bundle = _.cloneDeep(examplePatient);
      maskPatientData(bundle, []);
      expect(bundle).toEqual(examplePatient);
    });

    test('bundle should be modified to have dataAbsentReason for all fields specified in mask', () => {
      const bundle = _.cloneDeep(examplePatient);
      maskPatientData(bundle, ['gender', 'mrn', 'name', 'address', 'birthDate', 'language', 'ethnicity', 'birthsex', 'race']);
      expect(bundle).toEqual(exampleMaskedPatient);
    });

    test('should throw error when provided an invalid field to mask', () => {
      const bundle = _.cloneDeep(examplePatient);
      expect(() => maskPatientData(bundle, ['this is an invalid field', 'mrn'])).toThrowError();
    });
  });
  describe('maskMRN', () => {
    test('all occurances of the MRN as an id should be masked by a hashed version', () => {
      const bundle = _.cloneDeep(exampleBundleWithMRN);
      const hashedMRN = shajs('sha256').update(bundle.entry[0].resource.id).digest('hex');
      maskMRN(bundle);
      expect(bundle.entry[0].resource.id).toEqual(hashedMRN);
      expect(bundle.entry[0].fullUrl).toEqual(`urn:uuid:${hashedMRN}`);
      expect(bundle.entry[1].resource.subject.reference).toEqual(`urn:uuid:${hashedMRN}`);
      expect(bundle.entry[2].resource.individual.reference).toEqual(`urn:uuid:${hashedMRN}`);
    });
    test('should throw error when there is no Patient resource in bundle', () => {
      expect(() => maskMRN({})).toThrowError();
    });
  });
});
