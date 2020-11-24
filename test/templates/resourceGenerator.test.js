const rewire = require('rewire');

const resourceGenerator = rewire('../../src/templates/ResourceGenerator.js');

// Use Rewire to access private methods
const generateResourceId = resourceGenerator.__get__('generateResourceId');
const cleanEmptyData = resourceGenerator.__get__('cleanEmptyData');

// Some data to feed into the generateResourceId function
const MOCK_DATA_1 = {
  field: 'value',
};
const MOCK_DATA_2 = {
  field: 'value',
  field2: 'value2',
};

describe('generateResourceId', () => {
  test('Should give the same ID when given the same data', () => {
    expect(generateResourceId(MOCK_DATA_1)).toEqual(generateResourceId(MOCK_DATA_1));
  });

  test('Should give a different ID when given different data', () => {
    expect(generateResourceId(MOCK_DATA_1)).not.toEqual(generateResourceId(MOCK_DATA_2));
  });
});

describe('cleanEmptyData', () => {
  test('Should convert empty string and undefined values to null values', () => {
    const testObject = {
      id: 'example-id',
      code: 'example-code',
      display: 'example-display',
      system: 'example-system',
      status: '',
      evidence: undefined,
    };

    const cleanData = {
      id: 'example-id',
      code: 'example-code',
      display: 'example-display',
      system: 'example-system',
      status: null,
      evidence: null,
    };
    expect(cleanEmptyData(testObject)).toStrictEqual(cleanData);
  });

  test('Should convert empty string and undefined values within object properties to null values', () => {
    const testObject = {
      id: 'example-id',
      code: {
        code: 'example-code',
        display: '',
        system: {
          system: undefined,
          code: '',
        },
      },
      status: '',
      evidence: undefined,
    };

    const cleanData = {
      id: 'example-id',
      code: {
        code: 'example-code',
        display: null,
        system: {
          system: null,
          code: null,
        },
      },
      status: null,
      evidence: null,
    };
    expect(cleanEmptyData(testObject)).toStrictEqual(cleanData);
  });

  test('Should only be called recursively a maximum of 50 times', () => {
    const testObject = {
      id: 'example-id',
      code: {
        code: 'example-code',
        display: '',
        system: undefined,
      },
      status: '',
      nestedObject: {
        status: '',
        nestedObject: {},
      },
    };

    // Call cleanEmptyData with the recursive ceiling having been reached
    cleanEmptyData(testObject, 50);

    // The first object in the nest should have all of its properties cleaned
    expect(testObject.status).toStrictEqual(null);

    // Objects in the nest beyond the 50th call should still have non-standard properties
    expect(testObject.nestedObject.status).toStrictEqual('');
  });

  test('Handles circular references without crashing', () => {
    const testObject = {
      id: 'example-id',
      code: {
        code: 'example-code',
        display: '',
        system: undefined,
      },
      status: '',
      circular: {},
    };

    // Creating a circular reference
    testObject.circular = testObject;

    expect(() => cleanEmptyData(testObject)).not.toThrow();
  });
});
