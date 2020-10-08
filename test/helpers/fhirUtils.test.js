const {
  getQuantityUnit, getQuantityCode, isBundleEmpty, firstEntryInBundle, firstResourceInBundle, allResourcesInBundle, quantityCodeToUnitLookup,
} = require('../../src/helpers/fhirUtils.js');
const emptyBundle = require('./fixtures/emptyBundle.json');
const bundleWithOneEntry = require('./fixtures/searchsetBundleWithOneEntry.json');
const bundleWithMultipleEntries = require('./fixtures/searchsetBundleWithMultipleEntries.json');

test('getQuantityUnit should return the corresponding unit display value when passed a unit code', () => {
  Object.keys(quantityCodeToUnitLookup).forEach((unitCode) => {
    const unitText = quantityCodeToUnitLookup[unitCode];
    expect(getQuantityUnit(unitCode)).toEqual(unitText);
  });
});

test('getQuantityCode should return the corresponding unit code when passed a unit display value', () => {
  Object.keys(quantityCodeToUnitLookup).forEach((unitCode) => {
    const unitText = quantityCodeToUnitLookup[unitCode];
    expect(getQuantityCode(unitText)).toEqual(unitCode);
  });
});

test('isBundleEmpty', () => {
  // Empty bundle return true
  expect(isBundleEmpty(emptyBundle))
    .toBeTruthy();

  // Bundles with >=1 entry should return false
  expect(isBundleEmpty(bundleWithOneEntry))
    .toBeFalsy();
  expect(isBundleEmpty(bundleWithMultipleEntries))
    .toBeFalsy();
});

test('firstEntryInBundle', () => {
  // Empty bundle should return undefined
  expect(firstEntryInBundle(emptyBundle)).toBeUndefined();

  // Bundles with entries should always return the first
  expect(firstEntryInBundle(bundleWithOneEntry))
    .toEqual(bundleWithOneEntry.entry[0]);
  expect(firstEntryInBundle(bundleWithMultipleEntries))
    .toEqual(bundleWithMultipleEntries.entry[0]);
});

test('firstResourceInBundle', () => {
  // Empty bundle should throw an error
  expect(() => firstResourceInBundle(emptyBundle))
    .toThrow(TypeError("Cannot read property 'resource' of undefined"));

  // Bundles with entries should always return the first
  expect(firstResourceInBundle(bundleWithOneEntry))
    .toEqual(bundleWithOneEntry.entry[0].resource);
  expect(firstResourceInBundle(bundleWithMultipleEntries))
    .toEqual(bundleWithMultipleEntries.entry[0].resource);
});

test('allResourcesInBundle', () => {
  // Empty bundle should return an empty array
  expect(allResourcesInBundle(emptyBundle))
    .toEqual([]);

  // Bundles with entries should always return an array of each resource on each entry
  expect(allResourcesInBundle(bundleWithOneEntry))
    .toEqual([bundleWithOneEntry.entry[0].resource]);
  expect(allResourcesInBundle(bundleWithMultipleEntries))
    .toEqual(bundleWithMultipleEntries.entry.map((e) => e.resource));
});
