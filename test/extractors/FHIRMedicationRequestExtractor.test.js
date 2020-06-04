const rewire = require('rewire');
const { FHIRMedicationRequestExtractor } = require('../../src/extractors/FHIRMedicationRequestExtractor.js');
const examplePatientBundle = require('./fixtures/patient-bundle.json');

const FHIRMedicationRequestExtractorRewired = rewire('../../src/extractors/FHIRMedicationRequestExtractor.js');
const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_MRN = '123456789';
const MOCK_STATUSES = 'status1,status2';

// Construct extractor and create spies for mocking responses
const extractor = new FHIRMedicationRequestExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const extractorWithStatuses = new FHIRMedicationRequestExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, status: MOCK_STATUSES });
const baseStatuses = FHIRMedicationRequestExtractorRewired.__get__('BASE_STATUSES');

describe('FHIRMedicationRequestExtractor', () => {
  test('Constructor sets resourceType as MedicationRequest', () => {
    expect(extractor.resourceType).toEqual('MedicationRequest');
  });
  test('Constructor sets status based on BASE_STATUS if not provided', () => {
    expect(extractor.status).toEqual(baseStatuses);
  });
  test('Constructor sets status if provided', () => {
    expect(extractorWithStatuses.status).toEqual(MOCK_STATUSES);
  });

  test('parametrizeArgsForFHIRModule should not add status when not set to param values', async () => {
    // Create spy
    const { baseFHIRModule } = extractor;
    const baseFHIRModuleSearchSpy = jest.spyOn(baseFHIRModule, 'search');
    baseFHIRModuleSearchSpy
      .mockReturnValue(examplePatientBundle);

    const params = await extractor.parametrizeArgsForFHIRModule({ mrn: MOCK_MRN });
    expect(params).not.toHaveProperty('status');
  });

  test('parametrizeArgsForFHIRModule should add status when set to param values', async () => {
    // Create spy
    const { baseFHIRModule } = extractorWithStatuses;
    const baseFHIRModuleSearchSpy = jest.spyOn(baseFHIRModule, 'search');
    baseFHIRModuleSearchSpy
      .mockReturnValue(examplePatientBundle);

    const params = await extractorWithStatuses.parametrizeArgsForFHIRModule({ mrn: MOCK_MRN });
    expect(params).toHaveProperty('status');
    expect(params.status).toEqual(extractorWithStatuses.status);
  });
});
