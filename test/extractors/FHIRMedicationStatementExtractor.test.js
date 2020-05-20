const { FHIRMedicationStatementExtractor } = require('../../src/extractors/FHIRMedicationStatementExtractor.js');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};

const extractor = new FHIRMedicationStatementExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
describe('FHIRMedicationStatementExtractor', () => {
  test('Constructor sets resourceType as MedicationStatement', () => {
    expect(extractor.resourceType).toEqual('MedicationStatement');
  });
});
