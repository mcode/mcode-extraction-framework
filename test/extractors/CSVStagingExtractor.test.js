const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVStagingExtractor } = require('../../src/extractors');
const exampleStagingModuleResponse = require('./fixtures/csv-staging-module-response.json');
const exampleCSVStagingBundle = require('./fixtures/csv-staging-bundle.json');
const { getPatientFromContext } = require('../../src/helpers/contextUtils');
const MOCK_CONTEXT = require('./fixtures/context-with-patient.json');

// Constants for tests
const MOCK_PATIENT_MRN = 'mrn-1'; // linked to values in example-module-response above
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
      const expectedErrorString = 'Staging data is missing an expected property: conditionId, effectiveDate are required.';
      const localData = _.cloneDeep(exampleStagingModuleResponse[0]);
      const patientId = getPatientFromContext(MOCK_CONTEXT).id;

      // Test that valid data works fine
      expect(formatTNMCategoryData(localData, patientId)).toEqual(expect.anything());

      // Test all optional properties can be empty without issue
      localData.t = '';
      localData.m = '';
      localData.n = '';
      localData.type = '';
      localData.stagingSystem = '';
      localData.stagingCodeSystem = '';
      localData.stageGroup = '';

      // Only including required properties is valid
      expect(formatTNMCategoryData(localData)).toEqual(expect.anything());

      // Removing each required property should throw an error
      const requiredKeys = ['conditionId', 'effectiveDate'];
      requiredKeys.forEach((key) => {
        const clonedData = _.cloneDeep(localData);
        clonedData[key] = '';
        expect(() => formatTNMCategoryData(clonedData)).toThrow(new Error(expectedErrorString));
      });
    });
  });

  describe('get', () => {
    test('should return bundle with Observation', async () => {
      csvModuleSpy.mockReturnValue(exampleStagingModuleResponse);
      const data = await csvStagingExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(4);
      expect(data.entry).toEqual(exampleCSVStagingBundle.entry);
    });

    test('should return empty bundle when no data available from module', async () => {
      csvModuleSpy.mockReturnValue([]);
      const data = await csvStagingExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(0);
    });
  });
});
