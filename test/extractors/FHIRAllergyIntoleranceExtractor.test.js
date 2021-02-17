const rewire = require('rewire');
const { FHIRAllergyIntoleranceExtractor } = require('../../src/extractors/FHIRAllergyIntoleranceExtractor.js');

const FHIRAllergyIntoleranceExtractorRewired = rewire('../../src/extractors/FHIRAllergyIntoleranceExtractor.js');
const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_MRN = '123456789';
const MOCK_CLINICAL_STATUS = 'status1,status2';
const MOCK_CONTEXT = {
  resourceType: 'Bundle',
  entry: [
    {
      fullUrl: 'context-url',
      resource: { resourceType: 'Patient', id: MOCK_MRN },
    },
  ],
};

const extractor = new FHIRAllergyIntoleranceExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const extractorWithClinicalStatus = new FHIRAllergyIntoleranceExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, clinicalStatus: MOCK_CLINICAL_STATUS });
const baseClinicalStatus = FHIRAllergyIntoleranceExtractorRewired.__get__('BASE_CLINICAL_STATUS');

describe('FHIRAllergyIntoleranceExtractor', () => {
  describe('Constructor', () => {
    test('sets resourceType as AllergyIntolerance', () => {
      expect(extractor.resourceType).toEqual('AllergyIntolerance');
    });

    test('sets clinical status based on BASE_CLINICAL_STATUS', () => {
      expect(extractor.clinicalStatus).toEqual(baseClinicalStatus);
    });

    test('sets clinical status if provided', () => {
      expect(extractorWithClinicalStatus.clinicalStatus).toEqual(MOCK_CLINICAL_STATUS);
    });
  });

  describe('parametrizeArgsForFHIRModule', () => {
    test('should add category to param values', async () => {
      const params = await extractor.parametrizeArgsForFHIRModule({ context: MOCK_CONTEXT });
      expect(params).toHaveProperty('clinical-status');
      expect(params['clinical-status']).toEqual(baseClinicalStatus);
    });
  });
});
