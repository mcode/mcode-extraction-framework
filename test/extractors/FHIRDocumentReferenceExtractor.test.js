const { FHIRDocumentReferenceExtractor } = require('../../src/extractors/FHIRDocumentReferenceExtractor.js');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};

const extractor = new FHIRDocumentReferenceExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
describe('FHIRDocumentReferenceExtractor', () => {
  test('Constructor sets resourceType as DocumentReference', () => {
    expect(extractor.resourceType).toEqual('DocumentReference');
  });
});
