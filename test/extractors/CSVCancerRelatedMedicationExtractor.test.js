const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVCancerRelatedMedicationExtractor } = require('../../src/extractors');
const exampleCSVMedicationModuleResponse = require('./fixtures/csv-medication-module-response.json');
const exampleCSVMedicationBundle = require('./fixtures/csv-medication-bundle.json');

// Rewired extractor for helper tests
const CSVCancerRelatedMedicationExtractorRewired = rewire('../../src/extractors/CSVCancerRelatedMedicationExtractor.js');

// Constants for tests
const MOCK_PATIENT_MRN = 'mrn-1'; // linked to values in example-module-response above
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error

// Instantiate module with parameters
const csvCancerRelatedMedicationExtractor = new CSVCancerRelatedMedicationExtractor({
  filePath: MOCK_CSV_PATH,
});

// Destructure all modules
const { csvModule } = csvCancerRelatedMedicationExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');

const formatData = CSVCancerRelatedMedicationExtractorRewired.__get__('formatData');

// Creating an example bundle with two medication statements
const exampleEntry = exampleCSVMedicationModuleResponse[0];
const expandedExampleBundle = _.cloneDeep(exampleCSVMedicationBundle);
expandedExampleBundle.entry.push(exampleCSVMedicationBundle.entry[0]);

describe('CSVCancerRelatedMedicationExtractor', () => {
  describe('formatData', () => {
    test('should join data appropriately and throw errors when missing required properties', () => {
      const expectedErrorString = 'The cancer-related medication is missing an expected element; mrn, code, code system, start date, and end date are all required values.';
      const localData = _.cloneDeep(exampleCSVMedicationModuleResponse);

      // Test that valid maximal data works fine
      expect(formatData(exampleCSVMedicationModuleResponse)).toEqual(expect.anything());

      // Test that deleting an optional value works fine
      delete localData[0].treatmentIntent;
      expect(formatData(exampleCSVMedicationModuleResponse)).toEqual(expect.anything());

      // Test that deleting a mandatory value throws an error
      delete localData[0].code;
      expect(() => formatData(localData)).toThrow(new Error(expectedErrorString));
    });
  });

  describe('get', () => {
    test('should return bundle with a CancerRelatedMedication', async () => {
      csvModuleSpy.mockReturnValue(exampleCSVMedicationModuleResponse);
      const data = await csvCancerRelatedMedicationExtractor.get({ mrn: MOCK_PATIENT_MRN });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(1);
      expect(data.entry).toEqual(exampleCSVMedicationBundle.entry);
    });

    test('should return empty bundle when no data available from module', async () => {
      csvModuleSpy.mockReturnValue([]);
      const data = await csvCancerRelatedMedicationExtractor.get({ mrn: MOCK_PATIENT_MRN });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(0);
    });

    test('get() should return an array of 2 when two medication statements are tied to a single patient', async () => {
      exampleCSVMedicationModuleResponse.push(exampleEntry);
      csvModuleSpy.mockReturnValue(exampleCSVMedicationModuleResponse);
      const data = await csvCancerRelatedMedicationExtractor.get({ mrn: MOCK_PATIENT_MRN });

      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(2);
      expect(data).toEqual(expandedExampleBundle);
    });
  });
});
