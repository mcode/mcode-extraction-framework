const { FHIRPatientExtractor } = require('../../src/extractors/FHIRPatientExtractor.js');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_MRN = '123456789';

const extractor = new FHIRPatientExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
describe('FHIRPatientExtractor', () => {
  test('Constructor sets resourceType as Patient', () => {
    expect(extractor.resourceType).toEqual('Patient');
  });

  test('parametrizeArgsForFHIRModule should translate the MRN value into the identifier param', async () => {
    const params = await extractor.parametrizeArgsForFHIRModule({ mrn: MOCK_MRN });
    expect(params).toHaveProperty('identifier');
    expect(params.identifier).toEqual(`MRN|${MOCK_MRN}`);
  });
});
