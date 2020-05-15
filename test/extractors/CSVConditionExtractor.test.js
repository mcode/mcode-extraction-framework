const path = require('path');
const { CSVConditionExtractor } = require('../../src/extractors');
const exampleConditionResponse = require('./fixtures/csv-condition-module-response.json');
const exampleConditionBundle = require('./fixtures/csv-condition-bundle.json');

// Constants for mock tests
const MOCK_PATIENT_MRN = 'mrn-1';
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error
const csvConditionExtractor = new CSVConditionExtractor(MOCK_CSV_PATH);

const { csvModule } = csvConditionExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');
csvModuleSpy
  .mockReturnValue(exampleConditionResponse);

describe('CSV Condition Extractor tests', () => {
  test('get should return a fhir bundle when MRN is known', async () => {
    const data = await csvConditionExtractor.get({ mrn: MOCK_PATIENT_MRN });

    expect(data.resourceType).toEqual('Bundle');
    expect(data.type).toEqual('collection');
    expect(data.entry).toBeDefined();
    expect(data.entry.length).toEqual(1);
    expect(data).toEqual(exampleConditionBundle);
  });
});
