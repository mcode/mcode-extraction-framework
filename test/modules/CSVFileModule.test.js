const path = require('path');
const { CSVFileModule } = require('../../src/modules');
const exampleResponse = require('./fixtures/csv-response.json');

const INVALID_MRN = 'INVALID MRN';
const csvFileModule = new CSVFileModule(path.join(__dirname, './fixtures/example-csv.csv'));
const csvFileModuleWithBOMs = new CSVFileModule(path.join(__dirname, './fixtures/example-csv-bom.csv'));


describe('CSVFileModule', () => {
  describe('get', () => {
    test('Reads data from CSV', async () => {
      const data = await csvFileModule.get('mrn', 'example-mrn-1');
      expect(data).toEqual(exampleResponse);
    });

    test('Reads data from CSV with a Byte Order Mark', async () => {
      const data = await csvFileModuleWithBOMs.get('mrn', 'example-mrn-1');
      expect(data).toEqual(exampleResponse);
    });

    test('Returns multiple rows', async () => {
      const data = await csvFileModule.get('mrn', 'example-mrn-2');
      expect(data).toHaveLength(2);
    });

    test('Returns all rows when both key and value are undefined', async () => {
      const data = await csvFileModule.get();
      expect(data).toHaveLength(csvFileModule.data.length);
      expect(data).toEqual(csvFileModule.data);
    });

    test('Returns data with recordedDate after specified from date', async () => {
      const data = await csvFileModule.get('mrn', 'example-mrn-2', '2020-05-01');
      expect(data).toHaveLength(1);
    });

    test('Returns data with recordedDate before specified to date', async () => {
      const data = await csvFileModule.get('mrn', 'example-mrn-2', null, '2020-05-01');
      expect(data).toHaveLength(1);
    });

    test('Should return an empty array when key-value pair does not exist', async () => {
      const data = await csvFileModule.get('mrn', INVALID_MRN);
      expect(data).toEqual([]);
    });

    test('Should return proper value regardless of key casing', async () => {
      const data = await csvFileModule.get('mRN', 'example-mrn-1');
      expect(data).toEqual(exampleResponse);
    });
  });
});
