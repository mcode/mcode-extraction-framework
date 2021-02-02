const rewire = require('rewire');
const { FHIRConditionExtractor } = require('../../src/extractors/FHIRConditionExtractor.js');

const FHIRConditionExtractorRewired = rewire('../../src/extractors/FHIRConditionExtractor');
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

const extractor = new FHIRConditionExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const extractorWithCategories = new FHIRConditionExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, category: MOCK_CATEGORIES });
const baseCategories = FHIRConditionExtractorRewired.__get__('BASE_CATEGORIES');

describe('FHIRConditionExtractor', () => {
  describe('Constructor', () => {
    test('sets resourceType to Condition', () => {
      expect(extractor.resourceType).toEqual('Condition');
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
      const params = await extractor.parametrizeArgsForFHIRModule({ mrn: MOCK_MRN, context: MOCK_CONTEXT });
      expect(params).toHaveProperty('category');
      expect(params.category).toEqual(baseCategories);
    });
  });
});
