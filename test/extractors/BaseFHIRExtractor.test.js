const { when } = require('jest-when');
const { BaseFHIRExtractor } = require('../../src/extractors');
const examplePatientBundle = require('./fixtures/patient-bundle.json');

// Constants for mock tests
const MOCK_URL = 'http://localhost';
const MOCK_REQUEST_HEADERS = {
  Accept: 'application/json',
};
const MOCK_PATIENT_MRN = 'EXAMPLE-MRN';
const MOCK_RESOURCE_TYPE = 'Patient';

const baseFHIRExtractor = new BaseFHIRExtractor(MOCK_URL, MOCK_REQUEST_HEADERS);
// Destructure all modules
const { baseFHIRModule } = baseFHIRExtractor;


// Spy on baseFHIRModule
const baseFHIRModuleSpy = jest.spyOn(baseFHIRModule, 'search');
when(baseFHIRModuleSpy)
  .calledWith(MOCK_RESOURCE_TYPE, { identifier: MOCK_PATIENT_MRN })
  .mockReturnValue(examplePatientBundle);


test('test treatment plan change extraction', async () => {
  const data = await baseFHIRExtractor.get(MOCK_RESOURCE_TYPE, { identifier: MOCK_PATIENT_MRN });
  expect(data.resourceType).toEqual('Bundle');
  expect(data.entry).toBeDefined();
  expect(data.entry.length).toBeGreaterThan(0);

  // expect data to contain every element in the example
  expect(data.entry).toEqual(expect.arrayContaining(examplePatientBundle.entry));
});
