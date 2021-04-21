const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVAdverseEventExtractor } = require('../../src/extractors');
const exampleCSVAdverseEventModuleResponse = require('./fixtures/csv-adverse-event-module-response.json');
const exampleCSVAdverseEventBundle = require('./fixtures/csv-adverse-event-bundle.json');
const { getPatientFromContext } = require('../../src/helpers/contextUtils');
const MOCK_CONTEXT = require('./fixtures/context-with-patient.json');

// Constants for tests
const MOCK_PATIENT_MRN = 'mrn-1'; // linked to values in example-module-response and context-with-patient above
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error

// Instantiate module with parameters
const csvAdverseEventExtractor = new CSVAdverseEventExtractor({
  filePath: MOCK_CSV_PATH,
});

// Destructure all modules
const { csvModule } = csvAdverseEventExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');

// Creating an example bundle with two medication statements
const exampleEntry = exampleCSVAdverseEventModuleResponse[0];
const expandedExampleBundle = _.cloneDeep(exampleCSVAdverseEventBundle);
expandedExampleBundle.entry.push(exampleCSVAdverseEventBundle.entry[0]);

// Rewired extractor for helper tests
const CSVAdverseEventExtractorRewired = rewire('../../src/extractors/CSVAdverseEventExtractor.js');

describe('CSVAdverseEventExtractor', () => {
  describe('formatData', () => {
    const formatData = CSVAdverseEventExtractorRewired.__get__('formatData');
    test('should join data appropriately and throw errors when missing required properties', () => {
      const expectedErrorString = 'The adverse event is missing an expected attribute. Adverse event code and effective date are all required.';
      const expectedCategoryErrorString = 'A category attribute on the adverse event is missing a corresponding categoryCodeSystem or categoryDisplayText value.';
      const localData = _.cloneDeep(exampleCSVAdverseEventModuleResponse);
      const patientId = getPatientFromContext(MOCK_CONTEXT).id;

      // Test that valid maximal data works fine
      expect(formatData(exampleCSVAdverseEventModuleResponse, patientId)).toEqual(expect.anything());

      // Test that deleting an optional value works fine
      delete localData[0].actuality;
      expect(formatData(exampleCSVAdverseEventModuleResponse, patientId)).toEqual(expect.anything());

      // Test that adding another category but not adding a corresponding categoryCodeSystem throws an error
      localData[0].category = 'product-use-error|product-problem';
      expect(() => formatData(localData, patientId)).toThrow(new Error(expectedCategoryErrorString));

      // Test that adding another category but adding a corresponding categoryCodeSystem and categoryDisplayText works fine
      localData[0].categoryCodeSystem = 'http://terminology.hl7.org/CodeSystem/adverse-event-category|http://snomed.info/sct';
      localData[0].categoryDisplayText = 'Product Use Error|Product Problem';
      expect(formatData(localData, patientId)).toEqual(expect.anything());

      // Test that adding another category but including syntax for default categoryCodeSystem and categoryDisplayText values works fine
      localData[0].categoryCodeSystem = 'http://terminology.hl7.org/CodeSystem/adverse-event-category|';
      localData[0].categoryDisplayText = 'Product Use Error|';
      expect(formatData(localData, patientId)).toEqual(expect.anything());

      // Test that deleting a mandatory value throws an error
      delete localData[0].adverseEventCode;
      expect(() => formatData(localData, patientId)).toThrow(new Error(expectedErrorString));
    });
  });

  describe('get', () => {
    test('should return bundle with an AdverseEvent resource', async () => {
      csvModuleSpy.mockReturnValue(exampleCSVAdverseEventModuleResponse);
      const data = await csvAdverseEventExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(1);
      expect(data.entry).toEqual(exampleCSVAdverseEventBundle.entry);
    });

    test('should return empty bundle when no data available from module', async () => {
      csvModuleSpy.mockReturnValue([]);
      const data = await csvAdverseEventExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(0);
    });

    test('get() should return an array of 2 when two adverse event resources are tied to a single patient', async () => {
      exampleCSVAdverseEventModuleResponse.push(exampleEntry);
      csvModuleSpy.mockReturnValue(exampleCSVAdverseEventModuleResponse);
      const data = await csvAdverseEventExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });

      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(2);
      expect(data).toEqual(expandedExampleBundle);
    });
  });
});
