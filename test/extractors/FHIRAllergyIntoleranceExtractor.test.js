const rewire = require('rewire');
const { FHIRAllergyIntoleranceExtractor } = require('../../src/extractors/FHIRAllergyIntoleranceExtractor.js');
const examplePatientBundle = require('./fixtures/patient-bundle.json');

const FHIRAllergyIntoleranceExtractorRewired = rewire('../../src/extractors/FHIRAllergyIntoleranceExtractor.js');
const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_MRN = '123456789';
const MOCK_CLINICAL_STATUS = 'status1,status2';

const extractor = new FHIRAllergyIntoleranceExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const extractorWithClinicalStatus = new FHIRAllergyIntoleranceExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, clinicalStatus: MOCK_CLINICAL_STATUS });
const baseClinicalStatus = FHIRAllergyIntoleranceExtractorRewired.__get__('BASE_CLINICAL_STATUS');

describe('FHIRAllergyIntoleranceExtractor', () => {
  test('Constructor sets resourceType as AllergyIntolerance', () => {
    expect(extractor.resourceType).toEqual('AllergyIntolerance');
  });

  test('Constructor sets clinical status based on BASE_CLINICAL_STATUS', () => {
    expect(extractor.clinicalStatus).toEqual(baseClinicalStatus);
  });

  test('Constructor sets clinical status if provided', () => {
    expect(extractorWithClinicalStatus.clinicalStatus).toEqual(MOCK_CLINICAL_STATUS);
  });

  test('parametrizeArgsForFHIRModule should add category to param values', async () => {
    // Create spy
    const { baseFHIRModule } = extractor;
    const baseFHIRModuleSearchSpy = jest.spyOn(baseFHIRModule, 'search');
    baseFHIRModuleSearchSpy.mockReturnValue(examplePatientBundle);

    const params = await extractor.parametrizeArgsForFHIRModule({ mrn: MOCK_MRN });
    expect(params).toHaveProperty('clinical-status');
    expect(params['clinical-status']).toEqual(baseClinicalStatus);
  });
});
