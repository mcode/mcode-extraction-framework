const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVStagingExtractor } = require('../../src/extractors');
const exampleStagingModuleResponse = require('./fixtures/csv-staging-module-response.json');
const exampleCSVStagingBundle = require('./fixtures/csv-staging-bundle.json');

// Constants for tests
const MOCK_PATIENT_MRN = 'pat-mrn-1'; // linked to values in example-module-response above
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error

// Instantiate module with parameters
const csvStagingExtractor = new CSVStagingExtractor({ filePath: MOCK_CSV_PATH });

// Destructure all modules
const { csvModule } = csvStagingExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');

const formatTNMCategoryData = rewire('../../src/extractors/CSVStagingExtractor.js').__get__('formatTNMCategoryData');

describe('CSVStagingExtractor', () => {
  describe('formatTNMCategoryData', () => {
    test('should join data appropriately and throw errors when missing required properties', () => {
      const expectedErrorString = 'Staging data is missing an expected property: mrn, conditionId, effectiveDate are required.';
      const localData = _.cloneDeep(exampleStagingModuleResponse[0]);
      // Test that valid data works fine
      expect(formatTNMCategoryData(localData)).toEqual(expect.anything());

      // Test all required properties are
      delete localData.t;
      delete localData.m;
      delete localData.n;
      delete localData.type;
      delete localData.stageGroup;

      // Only including required properties is valid
      expect(formatTNMCategoryData(localData)).toEqual(expect.anything());

      // Removing each required property should throw an error
      Object.keys(localData).forEach((key) => {
        const clonedData = _.cloneDeep(localData);
        delete clonedData[key];
        expect(() => formatTNMCategoryData(clonedData)).toThrow(new Error(expectedErrorString));
      });
    });
  });

  describe('get', () => {
    test('should return bundle with Observation', async () => {
      csvModuleSpy.mockReturnValue(exampleStagingModuleResponse);
      const data = await csvStagingExtractor.get({ mrn: MOCK_PATIENT_MRN });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(4);
      expect(data.entry).toEqual(exampleCSVStagingBundle.entry);
    });

    test('should return empty bundle when no data available from module', async () => {
      csvModuleSpy.mockReturnValue([]);
      const data = await csvStagingExtractor.get({ mrn: MOCK_PATIENT_MRN });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(0);
    });
  });
});
