const rewire = require('rewire');
const { FHIRAdverseEventExtractor } = require('../../src/extractors/FHIRAdverseEventExtractor');

const FHIRAdverseEventExtractorRewired = rewire('../../src/extractors/FHIRAdverseEventExtractor.js');
const MOCK_URL = 'http://example.com';
const MOCK_HEADERS = {};
const MOCK_MRN = '123456789';
const MOCK_STUDIES = 'study1,study2';
const MOCK_CONTEXT = {
  resourceType: 'Bundle',
  entry: [
    {
      fullUrl: 'context-url',
      resource: { resourceType: 'Patient', id: MOCK_MRN },
    },
  ],
};
const researchStudyResource = {
  resourceType: 'ResearchStudy',
  id: 'ResearchStudyExample01',
};
const MOCK_CONTEXT_WITH_RESEARCH_STUDY = {
  resourceType: 'Bundle',
  type: 'collection',
  entry: [
    {
      fullUrl: 'context-url-1',
      resource: { resourceType: 'Patient', id: MOCK_MRN },
    },
    {
      fullUrl: 'context-url-2',
      resource: researchStudyResource,
    },
    {
      fullUrl: 'context-url-3',
      resource: { ...researchStudyResource, id: 'ResearchStudyExample02' },
    },
  ],
};

// Construct extractor and create spies for mocking responses
const extractor = new FHIRAdverseEventExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS });
const extractorWithStudy = new FHIRAdverseEventExtractor({ baseFhirUrl: MOCK_URL, requestHeaders: MOCK_HEADERS, study: MOCK_STUDIES });
const baseStudy = FHIRAdverseEventExtractorRewired.__get__('BASE_STUDY');

describe('FHIRAdverseEventExtractor', () => {
  describe('Constructor', () => {
    test('Constructor sets resourceType as AdverseEvent', () => {
      expect(extractor.resourceType).toEqual('AdverseEvent');
    });
    test('sets study based on BASE_STUDY if not provided', () => {
      expect(extractor.study).toEqual(baseStudy);
    });
    test('sets study if provided', () => {
      expect(extractorWithStudy.study).toEqual(MOCK_STUDIES);
    });
  });

  describe('parametrizeArgsForFHIRModule', () => {
    test('should not add study when not set to param values', async () => {
      const params = await extractor.parametrizeArgsForFHIRModule({ context: MOCK_CONTEXT });
      expect(params).not.toHaveProperty('study');
    });

    test('should add study id for all ResearchStudy resources that are in context', async () => {
      const params = await extractor.parametrizeArgsForFHIRModule({ context: MOCK_CONTEXT_WITH_RESEARCH_STUDY });
      expect(params).toHaveProperty('study');
      expect(params.study).toEqual(`${researchStudyResource.id},ResearchStudyExample02`);
    });

    describe('pass in optional study parameter', () => {
      test('should add study when set to param values', async () => {
        const params = await extractorWithStudy.parametrizeArgsForFHIRModule({ context: MOCK_CONTEXT });
        expect(params).toHaveProperty('study');
        expect(params.study).toEqual(extractorWithStudy.study);
      });

      test('should delete patient after its value is moved to subject', async () => {
        const params = await extractorWithStudy.parametrizeArgsForFHIRModule({ context: MOCK_CONTEXT });
        expect(params).not.toHaveProperty('patient');
      });

      test('should add study from study parameter and from context', async () => {
        const params = await extractorWithStudy.parametrizeArgsForFHIRModule({ context: MOCK_CONTEXT_WITH_RESEARCH_STUDY });
        expect(params).toHaveProperty('study');
        expect(params.study).toEqual(`${extractorWithStudy.study},${researchStudyResource.id},ResearchStudyExample02`);
      });
    });
  });
});
