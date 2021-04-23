const { validateCSV } = require('../../src/helpers/csvValidator');

const SIMPLE_DATA = [
  {
    header1: '1',
    header2: '2',
    header3: '3',
  },
  {
    header1: '4',
    header2: '',
    header3: '6',
  },
];

const SIMPLE_DATA_MISSING_REQUIRED_VALUE = [
  {
    header1: '',
    header2: '2',
    header3: '3',
  },
  {
    header1: '4',
    header2: '2',
    header3: '3',
  },
];

const SIMPLE_DATA_MISSING_HEADER = [
  {
    wrongHeader1: '1',
    header2: '2',
    header3: '3',
  },
  {
    wrongHeader1: '4',
    header2: '2',
    header3: '3',
  },
];

const SIMPLE_DATA_EXTRA_COLUMNS = [
  {
    header1: '1',
    header2: '2',
    header3: '3',
    header4: '4',
  },
  {
    header1: '5',
    header2: '6',
    header3: '7',
    header4: '',
  },
];

const SIMPLE_DATA_MISSING_OPTIONAL_COLUMN = [
  {
    header1: '1',
    header2: '2',
  },
  {
    header1: '3',
    header2: '4',
  },
];

const SIMPLE_DATA_DIFFERENT_CASING = [
  {
    Header1: '1',
    hEaDeR2: '2',
    header3: '3',
  },
];

const schema = {
  headers: [
    { name: 'header1', required: true },
    { name: 'header2' },
    { name: 'header3' },
  ],
};

describe('csvValidator', () => {
  test('simple data validates', () => {
    expect(validateCSV('', schema, SIMPLE_DATA)).toBe(true);
  });

  test('data missing required value does not validate', () => {
    expect(validateCSV('', schema, SIMPLE_DATA_MISSING_REQUIRED_VALUE)).toBe(false);
  });

  test('data missing required header does not validate', () => {
    expect(validateCSV('', schema, SIMPLE_DATA_MISSING_HEADER)).toBe(false);
  });

  test('data with erroneous column should still validate', () => {
    expect(validateCSV('', schema, SIMPLE_DATA_EXTRA_COLUMNS)).toBe(true);
  });

  test('data missing an optional column should still validate', () => {
    expect(validateCSV('', schema, SIMPLE_DATA_MISSING_OPTIONAL_COLUMN)).toBe(true);
  });

  test('data with different casing in the column header should still validate', () => {
    expect(validateCSV('', schema, SIMPLE_DATA_DIFFERENT_CASING)).toBe(true);
  });
});
