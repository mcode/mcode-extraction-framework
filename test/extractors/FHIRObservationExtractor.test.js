const rewire = require('rewire');
const { FHIRObservationExtractor } = require('../../src/extractors/FHIRObservationExtractor.js');

const FHIRObservationExtractorRewired = rewire('../../src/extractors/FHIRObservationExtractor.js');
const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_MRN = '123456789';
const MOCK_CATEGORIES = 'category1,category2';
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
const extractor = new FHIRObservationExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const extractorWithCategories = new FHIRObservationExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, category: MOCK_CATEGORIES });
const baseCategories = FHIRObservationExtractorRewired.__get__('BASE_CATEGORIES');

describe('FHIRObservationExtractor', () => {
  describe('Constructor', () => {
    test('sets resourceType as Observation', () => {
      expect(extractor.resourceType).toEqual('Observation');
    });
    test('sets category based on BASE_CATEGORIES if not provided', () => {
      expect(extractor.category).toEqual(baseCategories);
    });
    test('sets category if provided', () => {
      expect(extractorWithCategories.category).toEqual(MOCK_CATEGORIES);
    });
  });

  describe('parametrizeArgsForFHIRModule', () => {
    test('should add category to param values', async () => {
      const params = await extractor.parametrizeArgsForFHIRModule({ context: MOCK_CONTEXT });
      expect(params).toHaveProperty('category');
      expect(params.category).toEqual(baseCategories);
    });
  });
});
