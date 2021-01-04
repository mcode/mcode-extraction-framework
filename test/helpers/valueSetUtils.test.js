const path = require('path');
const { checkCodeInVs, vsTypes, loadJsonVs, loadVs } = require('../../src/helpers/valueSetUtils.js');
const exampleValueSet = require('./fixtures/valueset-without-expansion.json');

describe('valueSetUtils', () => {
  describe('vsTypes', () => {
    test('should define a json type', () => {
      expect(vsTypes).toHaveProperty('json');
    });
    test('should define a xml type', () => {
      expect(vsTypes).toHaveProperty('xml');
    });
    test('should define a turtle type', () => {
      expect(vsTypes).toHaveProperty('turtle');
    });
  });

  describe('loadJsonVs', () => {
    test('should throw when not given a filepath', () => {
      expect(() => loadJsonVs()).toThrow();
    });
    test('should throw when file does not exist', () => {
      expect(() => loadJsonVs('./path/does/not/exist')).toThrow("ENOENT: no such file or directory, open './path/does/not/exist'");
    });
    test('should load from the supplied filepath', () => {
      const valueSetFilePath = path.resolve(__dirname, 'fixtures', 'valueset-without-expansion.json');
      expect(loadJsonVs(valueSetFilePath)).toEqual(exampleValueSet);
    });
  });

  describe('loadVs', () => {
    test('should throw an error when xml type is provided', () => {
      expect(() => loadVs(undefined, vsTypes.xml)).toThrow('No defined valueset loader for `xml` type valuesets');
    });
    test('should throw an error when turtle is provided', () => {
      expect(() => loadVs(undefined, vsTypes.turtle)).toThrow('No defined valueset loader for `turtle` type valuesets');
    });
    test('should throw an error when an unrecoginized type is provided', () => {
      expect(() => loadVs(undefined, vsTypes.newType)).toThrow("'undefined' is not a recognized valueset type");
    });
    test('Should load a vs properly for json', () => {
      const valueSetFilePath = path.resolve(__dirname, 'fixtures', 'valueset-without-expansion.json');
      expect(loadVs(valueSetFilePath, vsTypes.json)).toEqual(exampleValueSet);
    });
  });

  describe('checkCodeInVs', () => {
    const includesCode = 'C00.0';
    const expansionCode = 'C00.1';
    const expansionCodeWithSystem = 'C00.2';
    const missingCode = 'C12.34';
    const icd10System = 'http://hl7.org/fhir/sid/icd-10-cm';
    const snomedSystem = 'http://snomed.info/sct';
    const vsPath = path.resolve(__dirname, 'fixtures', 'valueset-without-expansion.json');
    const vsWithExpansionPath = path.resolve(__dirname, 'fixtures', 'valueset-with-expansion.json');
    test('Should throw when not provided a vs', () => {
      expect(() => checkCodeInVs(includesCode, undefined)).toThrow();
    });
    test('Should return false when not provided a code', () => {
      // Note: This was the expected behavior of icd10System lookups before this separate module was created;
      // could be an opportunity for refactoring in the future, but not feasible to check now.
      expect(checkCodeInVs(undefined, icd10System, vsPath)).toBeFalsy();
    });
    test('Should return true if the code is in the VS includes', () => {
      expect(checkCodeInVs(includesCode, icd10System, vsPath, vsTypes.json)).toBeTruthy();
    });
    test('Should return false if the code is not in the VS includes', () => {
      expect(checkCodeInVs(expansionCode, icd10System, vsPath, vsTypes.json)).toBeFalsy();
    });
    test('Should return false if the code is in the VS includes but the systems do not match', () => {
      expect(checkCodeInVs(includesCode, snomedSystem, vsPath, vsTypes.json)).toBeFalsy();
    });
    test('Should return true if the code is in the VS expansion', () => {
      expect(checkCodeInVs(expansionCode, icd10System, vsWithExpansionPath, vsTypes.json)).toBeTruthy();
    });
    test('Should return false if the code is in the VS expansion but the systems do not match', () => {
      expect(checkCodeInVs(expansionCodeWithSystem, snomedSystem, vsWithExpansionPath, vsTypes.json)).toBeFalsy();
    });
    // Note: Expansions are a superset of includes; this is why we dont test "when an `includesCode` isn't in the expansion ValueSet"
    test('Should return false if the code is missing from both', () => {
      expect(checkCodeInVs(missingCode, icd10System, vsPath, vsTypes.json)).toBeFalsy();
      expect(checkCodeInVs(missingCode, icd10System, vsWithExpansionPath, vsTypes.json)).toBeFalsy();
    });
    test('Should check against a json valueSet when no type is provided', () => {
      expect(checkCodeInVs(includesCode, icd10System, vsPath)).toBeTruthy();
      expect(checkCodeInVs(expansionCode, icd10System, vsWithExpansionPath)).toBeTruthy();
      expect(checkCodeInVs(missingCode, icd10System, vsPath)).toBeFalsy();
    });
  });
});
