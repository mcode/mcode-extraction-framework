const { FHIRConditionExtractor } = require('../../src/extractors/FHIRConditionExtractor.js');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};



const extractor = new FHIRConditionExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });

describe('FHIRConditionExtractor', () => {
  describe('Constructor', () => {
    test('sets resourceType to Condition', () => {
      expect(extractor.resourceType).toEqual('Condition');
    });
  });
});
