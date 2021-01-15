const { FHIRAdverseEventExtractor } = require('../../src/extractors/FHIRAdverseEventExtractor');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};

const extractor = new FHIRAdverseEventExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
describe('FHIRAdverseEventExtractor', () => {
  test('Constructor sets resourceType as AdverseEvent', () => {
    expect(extractor.resourceType).toEqual('AdverseEvent');
  });
});
