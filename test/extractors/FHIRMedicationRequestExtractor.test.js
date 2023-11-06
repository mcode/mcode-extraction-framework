const { FHIRMedicationRequestExtractor } = require('../../src/extractors/FHIRMedicationRequestExtractor.js');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
// Construct extractor and create spies for mocking responses
const extractor = new FHIRMedicationRequestExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });

describe('FHIRMedicationRequestExtractor', () => {
  describe('Constructor', () => {
    test('sets resourceType as MedicationRequest', () => {
      expect(extractor.resourceType).toEqual('MedicationRequest');
    });
  });
});
