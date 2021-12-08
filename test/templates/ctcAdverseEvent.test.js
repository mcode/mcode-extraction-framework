const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const maximalValidExampleAdverseEvent = require('./fixtures/maximal-ctc-adverse-event-resource.json');
const minimalValidExampleAdverseEvent = require('./fixtures/minimal-ctc-adverse-event-resource.json');
const { CTCAdverseEventTemplate } = require('../../src/templates/CTCAdverseEventTemplate.js');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

const VALID_DATA = {
  subjectId: 'mrn-1',
  id: 'adverseEventId-1',
  code: '109006',
  system: 'code-system',
  display: 'Anxiety disorder of childhood OR adolescence',
  suspectedCauseId: 'procedure-id',
  suspectedCauseType: 'Procedure',
  seriousnessCode: 'serious',
  seriousnessCodeSystem: 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness',
  seriousnessDisplayText: 'Serious',
  category: [{ code: 'product-use-error', system: 'http://terminology.hl7.org/CodeSystem/adverse-event-category', display: 'Product Use Error' }],
  studyId: 'researchId-1',
  effectiveDateTime: '1994-12-09',
  recordedDateTime: '1994-12-09',
  grade: { code: '2', display: 'Moderate Adverse Event' },
};

const MINIMAL_DATA = {
  // Only include 'id', 'subjectId', 'code', 'system', 'grade', and 'effectiveDateTime' fields which are required
  subjectId: 'mrn-1',
  code: '109006',
  system: 'code-system',
  effectiveDateTime: '1994-12-09',
  id: 'adverseEventId-1',
  grade: { code: '2', display: 'Moderate Adverse Event' },
  display: null,
  suspectedCauseId: null,
  suspectedCauseType: null,
  seriousnessCode: null,
  seriousnessCodeSystem: null,
  seriousnessDisplayText: null,
  category: [null],
  studyId: null,
  recordedDateTime: null,
};


const INVALID_DATA = {
  // Omitting 'subjectId', 'code', 'system', and 'effectiveDateTime' fields which are required
  subjectId: null,
  code: null,
  system: null,
  effectiveDateTime: null,
  grade: null,
  id: 'adverseEventId-1',
  display: 'Anxiety disorder of childhood OR adolescence',
  suspectedCauseId: 'procedure-id',
  suspectedCauseType: 'Procedure',
  seriousnessCode: 'serious',
  seriousnessCodeSystem: 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness',
  seriousnessDisplayText: 'Serious',
  category: [{ code: 'product-use-error', system: 'http://terminology.hl7.org/CodeSystem/adverse-event-category' }],
  studyId: 'researchId-1',
  recordedDateTime: '1994-12-09',
};

describe('test Adverse Event template', () => {
  test('valid data passed into template should generate FHIR resource', () => {
    const generatedAdverseEvent = CTCAdverseEventTemplate(VALID_DATA);

    expect(generatedAdverseEvent).toEqual(maximalValidExampleAdverseEvent);
    expect(isValidFHIR(generatedAdverseEvent)).toBeTruthy();
  });

  test('minimal data passed into template should generate FHIR resource', () => {
    const generatedAdverseEvent = CTCAdverseEventTemplate(MINIMAL_DATA);

    expect(generatedAdverseEvent).toEqual(minimalValidExampleAdverseEvent);
    expect(isValidFHIR(generatedAdverseEvent)).toBeTruthy();
  });

  test('missing non-required data should not throw an error', () => {
    const OPTIONAL_DATA = {
      id: 'adverseEventId-1',
      display: 'Anxiety disorder of childhood OR adolescence',
      suspectedCauseId: 'procedure-id',
      suspectedCauseType: 'Procedure',
      seriousnessCode: 'Serious',
      seriousnessCodeSystem: 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness',
      seriousnessDisplayText: 'Serious',
      category: [{ code: 'product-use-error', system: 'http://terminology.hl7.org/CodeSystem/adverse-event-category' }],
      studyId: 'researchId-1',
      recordedDateTime: '1994-12-09',
    };

    const NECESSARY_DATA = {
      subjectId: 'mrn-1',
      code: '109006',
      system: 'code-system',
      effectiveDateTime: '1994-12-09',
      grade: { code: '2', display: 'Moderate Adverse Event' },
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, CTCAdverseEventTemplate, NECESSARY_DATA);
  });

  test('invalid data should throw an error', () => {
    expect(() => CTCAdverseEventTemplate(INVALID_DATA)).toThrow(Error);
  });
});