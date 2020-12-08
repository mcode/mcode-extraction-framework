const { values } = require('lodash');
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
      expect(() => loadJsonVs('./path/does/not/exist')).toThrow();
    });
    test('should load from the supplied filepath', () => {
      const valueSetFilePath = path.resolve(__dirname, './fixtures/valueset-without-expansion.json');
      expect(loadJsonVs(valueSetFilePath)).toEqual(exampleValueSet);
    });
  });

  describe('loadVs', () => {
    test('should throw an error when xml type is provided', () => {
      expect(() => loadVs(undefined, vsTypes.xml)).toThrow();
    });
    test('should throw an error when turtle is provided', () => {
      expect(() => loadVs(undefined, vsTypes.turtle)).toThrow();
    });
    test('should throw an error when an unrecoginized type is provided', () => {
      expect(() => loadVs(undefined, vsTypes.newType)).toThrow();
    });
    test('Should load a vs properly for json', () => {
      const valueSetFilePath = path.resolve(__dirname, './fixtures/valueset-without-expansion.json');
      expect(loadJsonVs(valueSetFilePath, vsTypes.json)).toEqual(exampleValueSet);
    });
  });

  describe('checkCodeInVs', () => {
    const includesCode = 'C00.0';
    const expansionCode = 'C00.1';
    const missingCode = 'C12.34';
    const vsPath = path.resolve(__dirname, './fixtures/valueset-without-expansion.json');
    const vsWithExpansionPath = path.resolve(__dirname, './fixtures/valueset-with-expansion.json');
    test('Should throw when not provided a vs', () => {
      expect(() => checkCodeInVs(includesCode, undefined)).toThrow();
    });
    test('Should return false when not provided a code', () => {
      // Note: This was the expected behavior of codesystem lookups before this separate module was created;
      // could be an opportunity for refactoring in the future, but not feasible to check now.
      expect(checkCodeInVs(undefined, vsPath)).toBeFalsy();
    });
    test('Should return true if the code is in the VS includes', () => {
      expect(checkCodeInVs(includesCode, vsPath, vsTypes.json)).toBeTruthy();
    });
    test('Should return false if the code is not in the VS includes', () => {
      expect(checkCodeInVs(expansionCode, vsPath, vsTypes.json)).toBeFalsy();
    });
    test('Should return true if the code is in the VS expansion', () => {
      expect(checkCodeInVs(expansionCode, vsWithExpansionPath, vsTypes.json)).toBeTruthy();
    });
    // Note: Expansions are a superset of includes; this is why we dont test "when an `includesCode` isn't in the expansion ValueSet"
    test('Should return false if the code is missing from both', () => {
      expect(checkCodeInVs(missingCode, vsPath, vsTypes.json)).toBeFalsy();
      expect(checkCodeInVs(missingCode, vsWithExpansionPath, vsTypes.json)).toBeFalsy();
    });
    test('Should check against a json valueSet when no type is provided', () => {
      expect(checkCodeInVs(includesCode, vsPath)).toBeTruthy();
      expect(checkCodeInVs(expansionCode, vsWithExpansionPath)).toBeTruthy();
      expect(checkCodeInVs(missingCode, vsPath)).toBeFalsy();
    });
  });
});
