const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const maximalValidExampleAdverseEvent = require('./fixtures/maximal-adverse-event-resource.json');
const minimalValidExampleAdverseEvent = require('./fixtures/minimal-adverse-event-resource.json');
const { adverseEventTemplate } = require('../../src/templates/AdverseEventTemplate.js');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

const VALID_DATA = {
  subjectId: 'mrn-1',
  id: 'adverseEventId-1',
  code: '109006',
  system: 'code-system',
  display: 'Anxiety disorder of childhood OR adolescence',
  suspectedCauseId: 'procedure-id',
  suspectedCauseType: 'Procedure',
  seriousnessCode: 'Serious',
  seriousnessCodeSystem: 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness',
  seriousnessDisplayText: 'Serious',
  category: [{ code: 'product-use-error', system: 'http://terminology.hl7.org/CodeSystem/adverse-event-category', display: 'Product Use Error' }],
  severity: 'severe',
  actuality: 'actual',
  studyId: 'researchId-1',
  effectiveDateTime: '1994-12-09',
  recordedDateTime: '1994-12-09',
};

const MINIMAL_DATA = {
  // Only include 'id', 'subjectId', 'code', 'system', 'actuality', and 'effectiveDateTime' fields which are required
  subjectId: 'mrn-1',
  code: '109006',
  system: 'code-system',
  effectiveDateTime: '1994-12-09',
  actuality: 'actual',
  id: 'adverseEventId-1',
  display: null,
  suspectedCauseId: null,
  suspectedCauseType: null,
  seriousnessCode: null,
  seriousnessCodeSystem: null,
  seriousnessDisplayText: null,
  category: [null],
  severity: null,
  studyId: null,
  recordedDateTime: null,
};


const INVALID_DATA = {
  // Omitting 'subjectId', 'code', 'system', 'actuality', and 'effectiveDateTime' fields which are required
  subjectId: null,
  code: null,
  system: null,
  effectiveDateTime: null,
  actuality: null,
  id: 'adverseEventId-1',
  display: 'Anxiety disorder of childhood OR adolescence',
  suspectedCauseId: 'procedure-id',
  suspectedCauseType: 'Procedure',
  seriousnessCode: 'Serious',
  seriousnessCodeSystem: 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness',
  seriousnessDisplayText: 'Serious',
  category: [{ code: 'product-use-error', system: 'http://terminology.hl7.org/CodeSystem/adverse-event-category' }],
  severity: 'severe',
  studyId: 'researchId-1',
  recordedDateTime: '1994-12-09',
};

describe('test Adverse Event template', () => {
  test('valid data passed into template should generate FHIR resource', () => {
    const generatedAdverseEvent = adverseEventTemplate(VALID_DATA);

    expect(generatedAdverseEvent).toEqual(maximalValidExampleAdverseEvent);
    expect(isValidFHIR(generatedAdverseEvent)).toBeTruthy();
  });

  test('minimal data passed into template should generate FHIR resource', () => {
    const generatedAdverseEvent = adverseEventTemplate(MINIMAL_DATA);

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
      severity: 'severe',
      studyId: 'researchId-1',
      recordedDateTime: '1994-12-09',
    };

    const NECESSARY_DATA = {
      subjectId: 'mrn-1',
      code: '109006',
      system: 'code-system',
      effectiveDateTime: '1994-12-09',
      actuality: 'actual',
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, adverseEventTemplate, NECESSARY_DATA);
  });

  test('invalid data should throw an error', () => {
    expect(() => adverseEventTemplate(INVALID_DATA)).toThrow(Error);
  });
});
