const path = require('path');
const { CSVModule } = require('../../src/modules');
const exampleResponse = require('./fixtures/csv-response.json');

const INVALID_MRN = 'INVALID MRN';
const csvModule = new CSVModule(path.join(__dirname, './fixtures/example-csv.csv'));
const csvModuleWithBOMs = new CSVModule(path.join(__dirname, './fixtures/example-csv-bom.csv'));

test('Reads data from CSV', async () => {
  const data = await csvModule.get('mrn', 'example-mrn-1');
  expect(data).toEqual(exampleResponse);
});

test('Reads data from CSV with a Byte Order Mark', async () => {
  const data = await csvModuleWithBOMs.get('mrn', 'example-mrn-1');
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

test('Returns data with recordedDate before specified to date', async () => {
  const data = await csvModule.get('mrn', 'example-mrn-2', null, '2020-05-01');
  expect(data).toHaveLength(1);
});

test('Should return an empty array when key-value pair does not exist', async () => {
  const data = await csvModule.get('mrn', INVALID_MRN);
  expect(data).toEqual([]);
});
