const path = require('path');
const { when } = require('jest-when');
const { ServiceClinicalTrialInformationExtractor } = require('../../src/extractors');
const examplePatient = require('../modules/fixtures/patient-resource.json');
const exampleClinicalTrialInformationResponse = require('./fixtures/csv-clinical-trial-information-module-response.json');
const exampleClinicalTrialInformationBundle = require('./fixtures/service-clinical-trial-information-bundle.json');

// Constants for mock tests
const MOCK_URL = 'http://localhost';
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error
const MOCK_REQUEST_HEADERS = {
  Accept: 'application/json',
};

const MOCK_PATIENT_MRN = 'EXAMPLE-MRN';

// Instantiate module with mock parameters
const csvClinicalTrialInformationExtractor = new ServiceClinicalTrialInformationExtractor(
  MOCK_URL,
  MOCK_REQUEST_HEADERS,
  MOCK_CSV_PATH,
);

// Destructure all modules
const { baseFHIRModule, csvModule } = csvClinicalTrialInformationExtractor;
const patientSearchset = {
  resourceType: 'Bundle',
  type: 'searchset',
  total: 1,
  entry: [
    { resource: examplePatient },
  ],
};

// Spy on baseFHIRModule
const baseFHIRModuleSpy = jest.spyOn(baseFHIRModule, 'search');
when(baseFHIRModuleSpy)
  .calledWith('Patient', { identifier: MOCK_PATIENT_MRN })
  .mockReturnValue(patientSearchset);

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');
csvModuleSpy
  .mockReturnValue(exampleClinicalTrialInformationResponse);

test('clinical trial information extractor', async () => {
  const data = await csvClinicalTrialInformationExtractor.get({ mrn: MOCK_PATIENT_MRN });

  expect(data.resourceType).toEqual('Bundle');
  expect(data.type).toEqual('collection');
  expect(data.entry).toBeDefined();
  expect(data.entry.length).toEqual(2);
  expect(data.entry).toEqual(exampleClinicalTrialInformationBundle.entry);
});
