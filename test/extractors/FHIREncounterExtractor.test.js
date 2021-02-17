const { FHIREncounterExtractor } = require('../../src/extractors/FHIREncounterExtractor.js');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};

const extractor = new FHIREncounterExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
describe('FHIREncounterExtractor', () => {
  test('Constructor sets resourceType as Encounter', () => {
    expect(extractor.resourceType).toEqual('Encounter');
  });
});
