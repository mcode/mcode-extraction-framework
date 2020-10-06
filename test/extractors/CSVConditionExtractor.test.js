const path = require('path');
const _ = require('lodash');
const { CSVConditionExtractor } = require('../../src/extractors');
const exampleConditionResponse = require('./fixtures/csv-condition-module-response.json');
const exampleConditionBundle = require('./fixtures/csv-condition-bundle.json');

// Constants for mock tests
const MOCK_PATIENT_MRN = 'mrn-1';
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error
const csvConditionExtractor = new CSVConditionExtractor({
  filePath: MOCK_CSV_PATH,
});

const { csvModule } = csvConditionExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');

// Creating an example bundle with two conditions 
const exampleEntry = exampleConditionResponse[0];
const expandedExampleBundle = _.cloneDeep(exampleConditionBundle);
expandedExampleBundle.entry.push(exampleConditionBundle.entry[0]);


describe('CSV Condition Extractor tests', () => {
  test('get should return a fhir bundle when MRN is known', async () => {
    csvModuleSpy.mockReturnValue(exampleConditionResponse);
    const data = await csvConditionExtractor.get({ mrn: MOCK_PATIENT_MRN });

    expect(data.resourceType).toEqual('Bundle');
    expect(data.type).toEqual('collection');
    expect(data.entry).toBeDefined();
    expect(data.entry.length).toEqual(1);
    expect(data).toEqual(exampleConditionBundle);
  });

  test('get() should return an array of 2 when two conditions are tied to a single patient', async () => {
    exampleConditionResponse.push(exampleEntry);
    csvModuleSpy.mockReturnValue(exampleConditionResponse);
    const data = await csvConditionExtractor.get({ mrn: MOCK_PATIENT_MRN });

    expect(data.resourceType).toEqual('Bundle');
    expect(data.type).toEqual('collection');
    expect(data.entry).toBeDefined();
    expect(data.entry.length).toEqual(2);
    expect(data).toEqual(expandedExampleBundle);
  });
});
