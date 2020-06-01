const rewire = require('rewire');
const { FHIRObservationExtractor } = require('../../src/extractors/FHIRObservationExtractor.js');

const FHIRObservationExtractorRewired = rewire('../../src/extractors/FHIRObservationExtractor.js');
const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_CATEGORIES = 'category1,category2';

const extractor = new FHIRObservationExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
describe('FHIRObservationExtractor', () => {
  test('Constructor sets resourceType as Observation', () => {
    expect(extractor.resourceType).toEqual('Observation');
  });
  test('Constructor sets category if provided', () => {
    const extractorWithCategories = new FHIRObservationExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, category: MOCK_CATEGORIES });
    expect(extractorWithCategories.category).toEqual(MOCK_CATEGORIES);
  });
  test('Constructor sets category is based on BASECATEGORY if not provided', () => {
    const baseCategories = FHIRObservationExtractorRewired.__get__('BASE_CATEGORIES');
    expect(extractor.category).toEqual(baseCategories);
  });
});
