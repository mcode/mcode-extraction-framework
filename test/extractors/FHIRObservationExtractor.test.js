const { FHIRObservationExtractor } = require('../../src/extractors/FHIRObservationExtractor.js');

const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};



// Construct extractor and create spies for mocking responses
const extractor = new FHIRObservationExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });

describe('FHIRObservationExtractor', () => {
  describe('Constructor', () => {
    test('sets resourceType as Observation', () => {
      expect(extractor.resourceType).toEqual('Observation');
    });
  });

});
