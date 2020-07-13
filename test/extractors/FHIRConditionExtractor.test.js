const rewire = require('rewire');
const { FHIRConditionExtractor } = require('../../src/extractors/FHIRConditionExtractor.js');
const examplePatientBundle = require('./fixtures/patient-bundle.json');

const FHIRConditionExtractorRewired = rewire('../../src/extractors/FHIRConditionExtractor');
const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_MRN = '123456789';
const MOCK_CATEGORIES = 'category1,category2';
const MOCK_STATUSES = 'status1,status2';

const extractor = new FHIRConditionExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const extractorWithCategories = new FHIRConditionExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, category: MOCK_CATEGORIES });
const extractorWithStatuses = new FHIRConditionExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, status: MOCK_STATUSES });
const baseCategories = FHIRConditionExtractorRewired.__get__('BASE_CATEGORIES');
const baseStatues = FHIRConditionExtractorRewired.__get__('BASE_STATUSES');

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

    test('sets status based on BASE_STATUS if not provided', () => {
      expect(extractor.status).toEqual(baseStatues);
    });

    test('sets status if provided', () => {
      expect(extractorWithStatuses.status).toEqual(MOCK_STATUSES);
    });
  });

  describe('parametrizeArgsForFHIRModule', () => {
    test('should add category to param values and not set statuses when not provided', async () => {
      // Create spy
      const { baseFHIRModule } = extractor;
      const baseFHIRModuleSpy = jest.spyOn(baseFHIRModule, 'search');
      baseFHIRModuleSpy.mockReturnValue(examplePatientBundle);

      const params = await extractor.parametrizeArgsForFHIRModule({ mrn: MOCK_MRN });
      expect(params).toHaveProperty('category');
      expect(params.category).toEqual(baseCategories);
      expect(params).not.toHaveProperty('clinical-status');
    });

    test('should not add status when no param values provided', async () => {
      // Create spy
      const { baseFHIRModule } = extractorWithStatuses;
      const baseFHIRModuleSpy = jest.spyOn(baseFHIRModule, 'search');
      baseFHIRModuleSpy.mockReturnValue(examplePatientBundle);

      const params = await extractorWithStatuses.parametrizeArgsForFHIRModule({ mrn: MOCK_MRN });
      expect(params).toHaveProperty('clinical-status');
      expect(params['clinical-status']).toEqual(extractorWithStatuses.status);
    });
  });
});
