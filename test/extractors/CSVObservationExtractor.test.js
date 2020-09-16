const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVObservationExtractor } = require('../../src/extractors');
const exampleCSVObservationModuleResponse = require('./fixtures/csv-observation-module-response.json');
const exampleCSVObservationBundle = require('./fixtures/csv-observation-bundle.json');

// Rewired extractor for helper tests
const CSVObservationExtractorRewired = rewire('../../src/extractors/CSVObservationExtractor.js');

// Constants for tests
const MOCK_PATIENT_MRN = 'pat-mrn-1'; // linked to values in example-module-response above
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error

// Instantiate module with parameters
const csvObservationExtractor = new CSVObservationExtractor({
  filePath: MOCK_CSV_PATH,
});

// Destructure all modules
const { csvModule } = csvObservationExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');

const formatData = CSVObservationExtractorRewired.__get__('formatData');

describe('CSVObservationExtractor', () => {
  describe('formatData', () => {
    test('should join data appropriately and throw errors when missing required properties', () => {
      const expectedErrorString = 'The observation is missing an expected attribute. Obervation id, mrn, status, code, code system, value, value code system, and effective date are all required.';
      const localData = _.cloneDeep(exampleCSVObservationModuleResponse);

      // Test that valid maximal data works fine
      expect(formatData(exampleCSVObservationModuleResponse)).toEqual(expect.anything());

      // Test that deleting an optional value works fine
      delete localData[0].bodySite;
      expect(formatData(exampleCSVObservationModuleResponse)).toEqual(expect.anything());

      // Test that deleting a mandatory value throws an error
      delete localData[0].status;
      expect(() => formatData(localData)).toThrow(new Error(expectedErrorString));
    });
  });

  describe('get', () => {
    test('should return bundle with Observation', async () => {
      csvModuleSpy.mockReturnValue(exampleCSVObservationModuleResponse);
      const data = await csvObservationExtractor.get({ mrn: MOCK_PATIENT_MRN });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(1);
      expect(data.entry).toEqual(exampleCSVObservationBundle.entry);
    });

    test('should return empty bundle when no data available from module', async () => {
      csvModuleSpy.mockReturnValue([]);
      const data = await csvObservationExtractor.get({ mrn: MOCK_PATIENT_MRN });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(0);
    });
  });
});
