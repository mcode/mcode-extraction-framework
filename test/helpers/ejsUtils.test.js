const rewire = require('rewire');

const ejsUtils = rewire('../../src/helpers/ejsUtils.js');

// Use Rewire to access private methods
const generateResourceId = ejsUtils.__get__('generateResourceId');

// Some data to feed into the generateResourceId function
const MOCK_DATA_1 = {
  field: 'value',
};
const MOCK_DATA_2 = {
  field: 'value',
  field2: 'value2',
};

test('generateResourceId', () => {
  // ID should be the same when given the same data
  expect(generateResourceId(MOCK_DATA_1)).toEqual(generateResourceId(MOCK_DATA_1));
  // ID should be different when given different data
  expect(generateResourceId(MOCK_DATA_1)).not.toEqual(generateResourceId(MOCK_DATA_2));
});
