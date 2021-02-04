const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVAdverseEventExtractor } = require('../../src/extractors');
const exampleCSVAdverseEventModuleResponse = require('./fixtures/csv-adverse-event-module-response.json');
const exampleCSVAdverseEventBundle = require('./fixtures/csv-adverse-event-bundle.json');

// Rewired extractor for helper tests
const CSVAdverseEventExtractorRewired = rewire('../../src/extractors/CSVAdverseEventExtractor.js');

// Constants for tests
const MOCK_PATIENT_MRN = 'mrn-1'; // linked to values in example-module-response above
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error

// Instantiate module with parameters
const csvAdverseEventExtractor = new CSVAdverseEventExtractor({
  filePath: MOCK_CSV_PATH,
});

// Destructure all modules
const { CSVModule } = csvAdverseEventExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(CSVModule, 'get');

const formatData = CSVAdverseEventExtractorRewired.__get__('formatData');

// Creating an example bundle with two medication statements
const exampleEntry = exampleCSVAdverseEventModuleResponse[0];
const expandedExampleBundle = _.cloneDeep(exampleCSVAdverseEventBundle);
expandedExampleBundle.entry.push(exampleCSVAdverseEventBundle.entry[0]);

describe('CSVAdverseEventExtractor', () => {
  describe('formatData', () => {
    test('should join data appropriately and throw errors when missing required properties', () => {
      const expectedErrorString = 'The adverse event is missing an expected attribute. Adverse event code, mrn, and effective date are all required.';
      const localData = _.cloneDeep(exampleCSVAdverseEventModuleResponse);

      // Test that valid maximal data works fine
      expect(formatData(exampleCSVAdverseEventModuleResponse)).toEqual(expect.anything());

      // Test that deleting an optional value works fine
      delete localData[0].actuality;
      expect(formatData(exampleCSVAdverseEventModuleResponse)).toEqual(expect.anything());

      // Test that deleting a mandatory value throws an error
      delete localData[0].mrn;
      expect(() => formatData(localData)).toThrow(new Error(expectedErrorString));
    });
  });

  describe('get', () => {
    test('should return bundle with an AdverseEvent resource', async () => {
      csvModuleSpy.mockReturnValue(exampleCSVAdverseEventModuleResponse);
      const data = await csvAdverseEventExtractor.get({ mrn: MOCK_PATIENT_MRN });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(1);
      expect(data.entry).toEqual(exampleCSVAdverseEventBundle.entry);
    });

    test('should return empty bundle when no data available from module', async () => {
      csvModuleSpy.mockReturnValue([]);
      const data = await csvAdverseEventExtractor.get({ mrn: MOCK_PATIENT_MRN });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(0);
    });

    test('get() should return an array of 2 when two adverse event resources are tied to a single patient', async () => {
      exampleCSVAdverseEventModuleResponse.push(exampleEntry);
      csvModuleSpy.mockReturnValue(exampleCSVAdverseEventModuleResponse);
      const data = await csvAdverseEventExtractor.get({ mrn: MOCK_PATIENT_MRN });

      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(2);
      expect(data).toEqual(expandedExampleBundle);
    });
  });
});