const { FHIRProcedureExtractor } = require('../../src/extractors/FHIRProcedureExtractor.js');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};

const extractor = new FHIRProcedureExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
describe('FHIRProcedureExtractor', () => {
  test('Constructor sets resourceType as Procedure', () => {
    expect(extractor.resourceType).toEqual('Procedure');
  });
});
