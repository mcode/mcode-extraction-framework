const {
  getQuantityUnit,
  isBundleEmpty,
  firstEntryInBundle,
  firstResourceInBundle,
  allResourcesInBundle,
  quantityCodeToUnitLookup,
  getResourceCountInBundle,
} = require('../../src/helpers/fhirUtils.js');
const emptyBundle = require('./fixtures/emptyBundle.json');
const bundleWithOneEntry = require('./fixtures/searchsetBundleWithOneEntry.json');
const bundleWithMultipleEntries = require('./fixtures/searchsetBundleWithMultipleEntries.json');
const countBundle5Unique = require('./fixtures/count-bundle-5-unique.json');
const countBundle5Same = require('./fixtures/count-bundle-5-same.json');
const countBundle5Nested = require('./fixtures/count-bundle-5-nested.json');

describe('getQuantityUnit', () => {
  test('Should return unit text if provided in lookup table', () => {
    Object.keys(quantityCodeToUnitLookup).forEach((unitCode) => {
      const unitText = quantityCodeToUnitLookup[unitCode];
      expect(getQuantityUnit(unitCode)).toEqual(unitText);
    });
  });

  test('Should return unit code if unit text is not provided', () => {
    expect(getQuantityUnit('foo')).toEqual('foo');
  });
});

describe('isBundleEmpty', () => {
  test('Empty bundle return true', () => {
    expect(isBundleEmpty(emptyBundle))
      .toBeTruthy();
  });

  test('Bundles with >=1 entry should return false', () => {
    expect(isBundleEmpty(bundleWithOneEntry))
      .toBeFalsy();
    expect(isBundleEmpty(bundleWithMultipleEntries))
      .toBeFalsy();
  });
});

describe('firstEntryInBundle', () => {
  test('Empty bundle should return undefined', () => {
  });
  expect(firstEntryInBundle(emptyBundle)).toBeUndefined();

  test('Bundles with entries should always return the first', () => {
    expect(firstEntryInBundle(bundleWithOneEntry))
      .toEqual(bundleWithOneEntry.entry[0]);
    expect(firstEntryInBundle(bundleWithMultipleEntries))
      .toEqual(bundleWithMultipleEntries.entry[0]);
  });
});

describe('firstResourceInBundle', () => {
  test('Empty bundle should throw an error', () => {
    expect(() => firstResourceInBundle(emptyBundle))
      .toThrow(TypeError("Cannot read property 'resource' of undefined"));
  });

  test('Bundles with entries should always return the first', () => {
    expect(firstResourceInBundle(bundleWithOneEntry))
      .toEqual(bundleWithOneEntry.entry[0].resource);
    expect(firstResourceInBundle(bundleWithMultipleEntries))
      .toEqual(bundleWithMultipleEntries.entry[0].resource);
  });
});

describe('allResourcesInBundle', () => {
  test('Empty bundle should return an empty array', () => {
    expect(allResourcesInBundle(emptyBundle))
      .toEqual([]);
  });


  test('Bundles with entries should always return an array of each resource on each entry', () => {
    expect(allResourcesInBundle(bundleWithOneEntry))
      .toEqual([bundleWithOneEntry.entry[0].resource]);
    expect(allResourcesInBundle(bundleWithMultipleEntries))
      .toEqual(bundleWithMultipleEntries.entry.map((e) => e.resource));
  });
});

describe('getResourceCountInBundle', () => {
  test('Returns an empty object when given an empty object', () => {
    const emptyCounts = {};
    expect(getResourceCountInBundle({})).toEqual(emptyCounts);
  });

  test('Counts five different resources, all at the same depth', () => {
    const counts = {
      'Resource-1': [1],
      'Resource-2': [1],
      'Resource-3': [1],
      'Resource-4': [1],
      'Resource-5': [1],
    };
    expect(getResourceCountInBundle(countBundle5Unique)).toEqual(counts);
  });

  test('Counts five of the same resources, all at the same depth', () => {
    const counts = {
      'Resource-1': [5],
    };
    expect(getResourceCountInBundle(countBundle5Same)).toEqual(counts);
  });

  test('Counts five of the same resources at various depths', () => {
    const counts = {
      'Resource-1': [5],
    };
    expect(getResourceCountInBundle(countBundle5Nested)).toEqual(counts);
  });
});
