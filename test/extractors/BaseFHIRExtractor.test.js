const { when } = require('jest-when');
const { BaseFHIRExtractor } = require('../../src/extractors');
const examplePatientBundle = require('./fixtures/patient-bundle.json');
const exampleConditionBundle = require('./fixtures/condition-bundle.json');

// Constants for mock tests
const MOCK_URL = 'http://localhost';
const MOCK_REQUEST_HEADERS = {
  Accept: 'application/json',
};
const MOCK_RESOURCE_TYPE = 'Condition';
const MOCK_PATIENT_MRN = 'EXAMPLE-MRN';
const MOCK_CONTEXT = {
  resourceType: 'Bundle',
  entry: [
    {
      fullUrl: 'context-url',
      resource: { resourceType: 'Patient', id: MOCK_PATIENT_MRN },
    },
  ],
};

// Create extractor and destructure to mock responses on modules
const baseFHIRExtractor = new BaseFHIRExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_REQUEST_HEADERS, resourceType: MOCK_RESOURCE_TYPE });
const { baseFHIRModule } = baseFHIRExtractor;

// Spies for mocking
const baseFHIRModuleSearchSpy = jest.spyOn(baseFHIRModule, 'search');
const moduleRequestHeadersSpy = jest.spyOn(baseFHIRModule, 'updateRequestHeaders');

// Ensure that data is returned for condition
when(baseFHIRModuleSearchSpy)
  .calledWith('Condition', { patient: examplePatientBundle.entry[0].resource.id })
  .mockReturnValue(exampleConditionBundle);

// Tests
describe('BaseFhirExtractor', () => {
  test('updateRequestHeaders calls its modules updateRequestHeaders function', () => {
    moduleRequestHeadersSpy.mockClear();
    baseFHIRExtractor.updateRequestHeaders(MOCK_REQUEST_HEADERS);
    expect(moduleRequestHeadersSpy).toHaveBeenCalledWith(MOCK_REQUEST_HEADERS);
  });

  test('parametrizeArgsForFHIRModule parses data off of context if available', async () => {
    baseFHIRModuleSearchSpy.mockClear();
    const paramsBasedOnContext = await baseFHIRExtractor.parametrizeArgsForFHIRModule({ context: MOCK_CONTEXT });
    expect(baseFHIRModuleSearchSpy).not.toHaveBeenCalled();
    expect(paramsBasedOnContext).toHaveProperty('patient');
    expect(paramsBasedOnContext.patient).toEqual(MOCK_CONTEXT.entry[0].resource.id);
  });

  test('parametrizeArgsForFHIRModule throws an error if context has no relevant ID', async () => {
    baseFHIRModuleSearchSpy.mockClear();
    await expect(baseFHIRExtractor.parametrizeArgsForFHIRModule({ context: {} })).rejects.toThrow();
    expect(baseFHIRModuleSearchSpy).not.toHaveBeenCalled();
  });

  test('get should return a condition resource', async () => {
    const data = await baseFHIRExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });
    expect(data.resourceType).toEqual('Bundle');
    expect(data.entry).toBeDefined();
    expect(data.entry.length).toBeGreaterThan(0);
    expect(data.entry[0].resource.resourceType).toEqual('Condition');

    // expect data to contain every element in the example
    expect(data.entry).toEqual(expect.arrayContaining(exampleConditionBundle.entry));
  });
});
