const path = require('path');
const { CSVClinicalTrialInformationExtractor } = require('../../src/extractors');
const exampleClinicalTrialInformationResponse = require('./fixtures/csv-clinical-trial-information-module-response.json');
const exampleClinicalTrialInformationBundle = require('./fixtures/csv-clinical-trial-information-bundle.json');

// Constants for mock tests
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error

const MOCK_PATIENT_MRN = 'EXAMPLE-MRN';

// Instantiate module with mock parameters
const csvClinicalTrialInformationExtractor = new CSVClinicalTrialInformationExtractor(MOCK_CSV_PATH);

// Destructure all modules
const { csvModule } = csvClinicalTrialInformationExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');
csvModuleSpy
  .mockReturnValue(exampleClinicalTrialInformationResponse);

test('clinical trial information extractor', async () => {
  const data = await csvClinicalTrialInformationExtractor.get({ mrn: MOCK_PATIENT_MRN });
  const exampleBundleWithMRN = { ...exampleClinicalTrialInformationBundle };

  expect(data.resourceType).toEqual('Bundle');
  expect(data.type).toEqual('collection');
  expect(data.entry).toBeDefined();
  expect(data.entry.length).toEqual(2);
  expect(data.entry).toEqual(exampleBundleWithMRN.entry);
});
