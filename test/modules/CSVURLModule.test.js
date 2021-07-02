const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { CSVURLModule } = require('../../src/modules');
const exampleResponse = require('./fixtures/csv-response.json');

const exampleCSV = fs.readFileSync(path.join(__dirname, './fixtures/example-csv.csv'));

// Instantiate module with mock parameters
const INVALID_MRN = 'INVALID MRN';
const MOCK_URL = 'http://example.com/some/data.csv';
const csvURLModule = new CSVURLModule(MOCK_URL);
jest.mock('axios');

describe('CSVURLModule', () => {
  describe('fillDataCache', () => {
    it('should make an axios-request when there is no data cached', async () => {
      // Mock response from axios before call
      axios.get.mockReset();
      axios.get.mockResolvedValue({ data: exampleCSV });
      expect(csvURLModule.data).toBeUndefined();
      await csvURLModule.fillDataCache();
      expect(axios.get).toHaveBeenCalled();
      expect(csvURLModule.data).not.toBeUndefined();
    });
    it('should make no requests when there is data cached', async () => {
      axios.get.mockReset();
      const exampleData = ['anything'];
      // Fix the data stored on the module
      csvURLModule.data = exampleData;
      expect(axios.get).not.toHaveBeenCalled();
      expect(csvURLModule.data).toBe(exampleData);
      // Since data is defined, this function call should do nothing
      await csvURLModule.fillDataCache();
      expect(axios.get).not.toHaveBeenCalled();
      expect(csvURLModule.data).toBe(exampleData);
      // Reset the data stored on the module
      csvURLModule.data = undefined;
    });
  });

  describe('get', () => {
    test('Reads data from CSV', async () => {
      axios.get.mockReset();
      axios.get.mockResolvedValue({ data: exampleCSV });
      const data = await csvURLModule.get('mrn', 'example-mrn-1');
      expect(data).toEqual(exampleResponse);
    });

    test('Returns multiple rows', async () => {
      axios.get.mockReset();
      axios.get.mockResolvedValue({ data: exampleCSV });
      const data = await csvURLModule.get('mrn', 'example-mrn-2');
      expect(data).toHaveLength(2);
    });

    test('Returns all rows when both key and value are undefined', async () => {
      axios.get.mockReset();
      axios.get.mockResolvedValue({ data: exampleCSV });
      const data = await csvURLModule.get();
      expect(data).toHaveLength(csvURLModule.data.length);
      expect(data).toEqual(csvURLModule.data);
    });

    test('Returns data with recordedDate after specified from date', async () => {
      axios.get.mockReset();
      axios.get.mockResolvedValue({ data: exampleCSV });
      const data = await csvURLModule.get('mrn', 'example-mrn-2', '2020-05-01');
      expect(data).toHaveLength(1);
    });

    test('Returns data with recordedDate before specified to date', async () => {
      axios.get.mockReset();
      axios.get.mockResolvedValue({ data: exampleCSV });
      const data = await csvURLModule.get('mrn', 'example-mrn-2', null, '2020-05-01');
      expect(data).toHaveLength(1);
    });

    test('Should return an empty array when key-value pair does not exist', async () => {
      axios.get.mockReset();
      axios.get.mockResolvedValue({ data: exampleCSV });
      const data = await csvURLModule.get('mrn', INVALID_MRN);
      expect(data).toEqual([]);
    });

    test('Should return proper value regardless of key casing', async () => {
      axios.get.mockReset();
      axios.get.mockResolvedValue({ data: exampleCSV });
      const data = await csvURLModule.get('mRN', 'example-mrn-1');
      expect(data).toEqual(exampleResponse);
    });
  });
});
