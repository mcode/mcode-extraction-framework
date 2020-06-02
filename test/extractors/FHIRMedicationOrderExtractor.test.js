const { FHIRMedicationOrderExtractor } = require('../../src/extractors/FHIRMedicationOrderExtractor.js');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};

const extractor = new FHIRMedicationOrderExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
describe('FHIRMedicationOrderExtractor', () => {
  test('Constructor sets resourceType as MedicationOrder', () => {
    expect(extractor.resourceType).toEqual('MedicationOrder');
  });
});
