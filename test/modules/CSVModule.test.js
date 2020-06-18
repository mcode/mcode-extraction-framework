const path = require('path');
const { CSVModule } = require('../../src/modules');
const exampleResponse = require('./fixtures/csv-response.json');

const INVALID_MRN = 'INVALID MRN';
const csvModule = new CSVModule(path.join(__dirname, './fixtures/example-csv.csv'));

test('Reads data from CSV', async () => {
  const data = await csvModule.get('mrn', 'example-mrn-1');
  expect(data).toEqual(exampleResponse);
});

test('Returns multiple rows', async () => {
  const data = await csvModule.get('mrn', 'example-mrn-2');
  expect(data).toHaveLength(2);
});

test('Returns all rows when both key and value are undefined', async () => {
  const data = await csvModule.get();
  expect(data).toHaveLength(csvModule.data.length);
  expect(data).toEqual(csvModule.data);
});

test('Returns data with recordedDate after specified from date', async () => {
  const data = await csvModule.get('mrn', 'example-mrn-2', '2020-05-01');
  expect(data).toHaveLength(1);
});

test('Invalid MRN', async () => {
  try {
    await csvModule.get('mrn', INVALID_MRN);
  } catch (e) {
    expect(e).toEqual(ReferenceError('CSV Record with provided key \'mrn\' and value was not found'));
  }
});
