const rewire = require('rewire');
const { FHIRMedicationRequestExtractor } = require('../../src/extractors/FHIRMedicationRequestExtractor.js');

const FHIRMedicationRequestExtractorRewired = rewire('../../src/extractors/FHIRMedicationRequestExtractor.js');
const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_MRN = '123456789';
const MOCK_STATUSES = 'status1,status2';
const MOCK_CONTEXT = {
  resourceType: 'Bundle',
  entry: [
    {
      fullUrl: 'context-url',
      resource: { resourceType: 'Patient', id: MOCK_MRN },
    },
  ],
};

// Construct extractor and create spies for mocking responses
const extractor = new FHIRMedicationRequestExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const extractorWithStatuses = new FHIRMedicationRequestExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, status: MOCK_STATUSES });
const baseStatuses = FHIRMedicationRequestExtractorRewired.__get__('BASE_STATUSES');

describe('FHIRMedicationRequestExtractor', () => {
  describe('Constructor', () => {
    test('sets resourceType as MedicationRequest', () => {
      expect(extractor.resourceType).toEqual('MedicationRequest');
    });
    test('sets status based on BASE_STATUS if not provided', () => {
      expect(extractor.status).toEqual(baseStatuses);
    });
    test('sets status if provided', () => {
      expect(extractorWithStatuses.status).toEqual(MOCK_STATUSES);
    });
  });

  describe('parametrizeArgsForFHIRModule', () => {
    test('should not add status when not set to param values', async () => {
      const params = await extractor.parametrizeArgsForFHIRModule({ mrn: MOCK_MRN, context: MOCK_CONTEXT });
      expect(params).not.toHaveProperty('status');
    });

    test('should add status when set to param values', async () => {
      const params = await extractorWithStatuses.parametrizeArgsForFHIRModule({ mrn: MOCK_MRN, context: MOCK_CONTEXT });
      expect(params).toHaveProperty('status');
      expect(params.status).toEqual(extractorWithStatuses.status);
    });
  });
});
