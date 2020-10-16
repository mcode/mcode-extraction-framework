const rewire = require('rewire');

const resourceGenerator = rewire('../../src/templates/ResourceGenerator.js');

// Use Rewire to access private methods
const generateResourceId = resourceGenerator.__get__('generateResourceId');

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
