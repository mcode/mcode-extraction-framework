const {
  getQuantityUnit,
  isBundleEmpty,
  firstEntryInBundle,
  firstIdentifierEntry,
  firstResourceInBundle,
  allResourcesInBundle,
  quantityCodeToUnitLookup,
  getResourceCountInBundle,
  isValidFHIR,
  invalidResourcesFromBundle,
} = require('../../src/helpers/fhirUtils.js');
const emptyBundle = require('./fixtures/emptyBundle.json');
const bundleWithOneEntry = require('./fixtures/searchsetBundleWithOneEntry.json');
const bundleWithMultipleEntries = require('./fixtures/searchsetBundleWithMultipleEntries.json');
const countBundle5Unique = require('./fixtures/count-bundle-5-unique.json');
const countBundle5Same = require('./fixtures/count-bundle-5-same.json');
const countBundle5Nested = require('./fixtures/count-bundle-5-nested.json');
const validResource = require('./fixtures/valid-resource');
const invalidResource = require('./fixtures/invalid-resource');

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
    expect(firstEntryInBundle(emptyBundle)).toBeUndefined();
  });

  test('Bundles with entries should always return the first', () => {
    expect(firstEntryInBundle(bundleWithOneEntry))
      .toEqual(bundleWithOneEntry.entry[0]);
    expect(firstEntryInBundle(bundleWithMultipleEntries))
      .toEqual(bundleWithMultipleEntries.entry[0]);
  });
});

describe('firstIdentifierEntry', () => {
  test('Resource with no identifier returns null', () => {
    expect(firstIdentifierEntry({})).toBeNull();
  });

  test('Resource with identifier gives first value', () => {
    const id1 = {
      system: 'example',
      value: 'example-value',
    };
    const id2 = {
      system: 'example2',
      value: 'example-value2',
    };
    const resourceWithIdentifier = {
      identifier: [id1, id2],
    };

    expect(firstIdentifierEntry(resourceWithIdentifier)).toEqual(id1);
  });
});

describe('firstResourceInBundle', () => {
  test('Empty bundle should throw an error', () => {
    expect(() => firstResourceInBundle(emptyBundle))
      .toThrow(TypeError("Cannot read properties of undefined (reading 'resource')"));
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

describe('isValidFHIR', () => {
  test('Should return true when provided valid FHIR resources', () => {
    expect(isValidFHIR(validResource)).toEqual(true);
  });

  test('Should return false when provided invalid FHIR resources', () => {
    expect(isValidFHIR(invalidResource)).toEqual(false);
  });
});

describe('invalidResourcesFromBundle', () => {
  test('Should return an empty array when all resources are valid', () => {
    expect(invalidResourcesFromBundle(emptyBundle)).toEqual([]);
  });

  test('Should return an error for each invalid resource', () => {
    const secondInvalidResource = {
      ...invalidResource,
      id: 'secondInvalidResource',
    };

    const invalidBundleWithTwoResources = {
      resourceType: 'Bundle',
      entry: [
        {
          resource: invalidResource,
        },
        {
          resource: secondInvalidResource,
        },
      ],
    };

    const response = invalidResourcesFromBundle(invalidBundleWithTwoResources);

    const invalidResourceId = `${invalidResource.resourceType}-${invalidResource.id}`;
    const invalidResourceId2 = `${secondInvalidResource.resourceType}-${secondInvalidResource.id}`;

    expect(response).toHaveLength(2);
    expect(response).toEqual(expect.arrayContaining([
      expect.objectContaining({
        failureId: invalidResourceId,
      }),
      expect.objectContaining({
        failureId: invalidResourceId2,
      }),
    ]));
  });

  test('Should return detailed error for invalid resource', () => {
    const invalidBundle = { ...bundleWithOneEntry };
    invalidBundle.entry[0].resource = invalidResource;
    // This is dependent on implementation details intrinsic to invalidResourcesFromBundle
    const invalidResourceId = `${invalidResource.resourceType}-${invalidResource.id}`;
    expect(invalidResourcesFromBundle(invalidBundle)).toEqual([
      {
        failureId: invalidResourceId,
        errors: [
          {
            keyword: 'enum',
            dataPath: '.gender',
            schemaPath: '#/properties/gender/enum',
            params: {
              allowedValues: [
                'male',
                'female',
                'other',
                'unknown',
              ],
            },
            message: 'should be equal to one of the allowed values',
          },
        ],
      },
    ]);
  });

  test('Should return multiple errors if present within the same resource', () => {
    // invalidResource already has an invalid gender enum value
    const invalidResourceWithTwoProps = {
      ...invalidResource,
      birthDate: 'not-a-real-date',
    };

    const invalidBundle = {
      resourceType: 'Bundle',
      entry: [
        {
          resource: invalidResourceWithTwoProps,
        },
      ],
    };

    const response = invalidResourcesFromBundle(invalidBundle);

    expect(response).toHaveLength(1);

    const [invalidResponseObj] = response;

    expect(invalidResponseObj.errors).toBeDefined();
    expect(invalidResponseObj.errors).toHaveLength(2);
  });
});
