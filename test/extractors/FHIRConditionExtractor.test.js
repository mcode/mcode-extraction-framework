const rewire = require('rewire');
const { FHIRConditionExtractor } = require('../../src/extractors/FHIRConditionExtractor.js');
const examplePatientBundle = require('./fixtures/patient-bundle.json');

const FHIRConditionExtractorRewired = rewire('../../src/extractors/FHIRConditionExtractor');
const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_MRN = '123456789';
const MOCK_CATEGORIES = 'category1,category2';

const extractor = new FHIRConditionExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const extractorWithCategories = new FHIRConditionExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, category: MOCK_CATEGORIES });
const baseCategories = FHIRConditionExtractorRewired.__get__('BASE_CATEGORIES');

describe('FHIRConditionExtractor', () => {
  test('Constructor sets resourceType to Condition', () => {
    expect(extractor.resourceType).toEqual('Condition');
  });

  test('Constructor sets category based on BASE_CATEGORIES if not provided', () => {
    expect(extractor.category).toEqual(baseCategories);
  });

  test('Constructor sets category if provided', () => {
    expect(extractorWithCategories.category).toEqual(MOCK_CATEGORIES);
  });

  test('parametrizeArgsForFHIRModule should add category to param values', async () => {
    // Create spy
    const { baseFHIRModule } = extractor;
    const baseFHIRModuleSpy = jest.spyOn(baseFHIRModule, 'search');
    baseFHIRModuleSpy.mockReturnValue(examplePatientBundle);

    const params = await extractor.parametrizeArgsForFHIRModule({ mrn: MOCK_MRN });
    expect(params).toHaveProperty('category');
    expect(params.category).toEqual(baseCategories);
  });
});
