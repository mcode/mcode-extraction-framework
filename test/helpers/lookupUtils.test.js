const { createLowercaseLookup, createInvertedLookup, lowercaseLookupQuery } = require('../../src/helpers/lookupUtils');

describe('lookupUtils', () => {
  describe('createLowercaseLookup', () => {
    const exampleLookup = {
      foo: 'bar',
      'apples AND': 'oranges',
      AI: 'ethics',
    };
    const lowercaseLookup = createLowercaseLookup(exampleLookup);

    test('should fail if supplied an undefined or null value', () => {
      expect(() => createInvertedLookup()).toThrow();
      expect(() => createInvertedLookup(undefined)).toThrow();
      expect(() => createInvertedLookup(null)).toThrow();
    });

    test('all new keys should match the lowercased original keys', () => {
      const lowercasedExampleKeys = Object.keys(exampleLookup).map((k) => k.toLowerCase());
      expect(Object.keys(lowercaseLookup)).toEqual(lowercasedExampleKeys);
    });

    test('values should remain unchanged after lowercasing', () => {
      const originalValues = Object.values(exampleLookup);
      expect(Object.values(lowercaseLookup)).toEqual(originalValues);
    });

    test('# of keys should stay the same', () => {
      expect(Object.keys(lowercaseLookup).length).toEqual(Object.values(exampleLookup).length);
    });
  });

  describe('createInvertedLookup', () => {
    const exampleLookup = {
      foo: 'bar',
      'apples AND': 'oranges',
      AI: 'ethics',
    };
    const invertedLookup = createInvertedLookup(exampleLookup);

    test('should fail if supplied a non-object', () => {
      expect(() => createInvertedLookup()).toThrow();
      expect(() => createInvertedLookup(undefined)).toThrow();
      expect(() => createInvertedLookup(null)).toThrow();
    });

    test('all old values should be keys after inversion', () => {
      expect(Object.keys(invertedLookup)).toEqual(expect.arrayContaining(Object.values(exampleLookup)));
    });

    test('all old keys should be values after inversion', () => {
      expect(Object.values(invertedLookup)).toEqual(expect.arrayContaining(Object.keys(exampleLookup)));
    });

    test('# of new keys should match the # of values in the old object', () => {
      expect(Object.keys(invertedLookup).length).toEqual(Object.values(exampleLookup).length);
    });

    test('# of new values should match the # of keys in the old object', () => {
      expect(Object.values(invertedLookup).length).toEqual(Object.keys(exampleLookup).length);
    });
  });

  describe('lowercaseLookupQuery', () => {
    const exampleLookup = {
      foo: 'bar',
      'apples AND': 'oranges',
      AI: 'ethics',
    };
    // Create a lowercased lookup as this is
    const lowercaseLookup = createLowercaseLookup(exampleLookup);
    const originalCaseKeys = Object.keys(exampleLookup);
    const lowercaseKeys = Object.keys(exampleLookup).map((k) => k.toLowerCase());
    const uppercaseKeys = Object.keys(exampleLookup).map((k) => k.toUpperCase());

    test('lookup should return undefined when the value provided is not defined in the lookup', () => {
      expect(lowercaseLookupQuery('', lowercaseLookup)).toEqual(undefined);
    });

    test('lookup should work for the lowercased keys', () => {
      lowercaseKeys.forEach((lowercaseKey) => {
        expect(lowercaseLookupQuery(lowercaseKey, lowercaseLookup)).toEqual(lowercaseLookup[lowercaseKey]);
      });
    });
    test('lookup should work for the originalcase keys', () => {
      originalCaseKeys.forEach((originalCaseKey) => {
        expect(lowercaseLookupQuery(originalCaseKey, lowercaseLookup)).toEqual(lowercaseLookup[originalCaseKey.toLowerCase()]);
      });
    });
    test('lookup should work for the uppercased keys', () => {
      uppercaseKeys.forEach((uppercaseKey) => {
        expect(lowercaseLookupQuery(uppercaseKey, lowercaseLookup)).toEqual(lowercaseLookup[uppercaseKey.toLowerCase()]);
      });
    });
  });
});
