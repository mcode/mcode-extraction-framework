const rewire = require('rewire');
const { FHIRObservationExtractor } = require('../../src/extractors/FHIRObservationExtractor.js');
const examplePatientBundle = require('./fixtures/patient-bundle.json');

const FHIRObservationExtractorRewired = rewire('../../src/extractors/FHIRObservationExtractor.js');
const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_MRN = '123456789';
const MOCK_CATEGORIES = 'category1,category2';

// Construct extractor and create spies for mocking responses
const extractor = new FHIRObservationExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const extractorWithCategories = new FHIRObservationExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, category: MOCK_CATEGORIES });
const baseCategories = FHIRObservationExtractorRewired.__get__('BASE_CATEGORIES');

describe('FHIRObservationExtractor', () => {
  test('Constructor sets resourceType as Observation', () => {
    expect(extractor.resourceType).toEqual('Observation');
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
    const baseFHIRModuleSearchSpy = jest.spyOn(baseFHIRModule, 'search');
    baseFHIRModuleSearchSpy
      .mockReturnValue(examplePatientBundle);

    const params = await extractor.parametrizeArgsForFHIRModule({ mrn: MOCK_MRN });
    expect(params).toHaveProperty('category');
    expect(params.category).toEqual(baseCategories);
  });
});
