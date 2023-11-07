const { FHIRAllergyIntoleranceExtractor } = require('../../src/extractors/FHIRAllergyIntoleranceExtractor.js');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};

const extractor = new FHIRAllergyIntoleranceExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });

describe('FHIRAllergyIntoleranceExtractor', () => {
  describe('Constructor', () => {
    test('sets resourceType as AllergyIntolerance', () => {
      expect(extractor.resourceType).toEqual('AllergyIntolerance');
    });
  });
});
