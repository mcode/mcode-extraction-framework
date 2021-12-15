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
  version: 'code-version',
  display: 'Anxiety disorder of childhood OR adolescence',
  text: 'event-text',
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
  resolvedDate: '2021-12-09',
  seriousnessOutcome: {
    code: 'C113380',
    system: 'http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl',
    display: 'Disabling Adverse Event',
  },
  expectation: {
    code: 'C41333',
    system: 'http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl',
    display: 'Expected Adverse Event',
  },
  actor: 'practitioner-id',
  functionCode: {
    code: 'PART',
    system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
    display: 'Participation',
  },
};

const MINIMAL_DATA = {
  // Only include 'id', 'subjectId', 'code', 'system', 'grade', and 'effectiveDateTime' fields which are required
  subjectId: 'mrn-1',
  code: '109006',
  system: 'code-system',
  effectiveDateTime: '1994-12-09',
  id: 'adverseEventId-1',
  grade: { code: '2', display: 'Moderate Adverse Event' },
  version: null,
  display: null,
  text: null,
  suspectedCauseId: null,
  suspectedCauseType: null,
  seriousnessCode: null,
  seriousnessCodeSystem: null,
  seriousnessDisplayText: null,
  category: [null],
  studyId: null,
  recordedDateTime: null,
  resolvedDate: null,
  seriousnessOutcome: null,
  expectation: null,
};


const INVALID_DATA = {
  // Omitting 'subjectId', 'code', 'system', and 'effectiveDateTime' fields which are required
  subjectId: null,
  code: null,
  system: null,
  effectiveDateTime: null,
  grade: null,
  text: 'event-text',
  id: 'adverseEventId-1',
  version: 'code-version',
  display: 'Anxiety disorder of childhood OR adolescence',
  suspectedCauseId: 'procedure-id',
  suspectedCauseType: 'Procedure',
  seriousnessCode: 'serious',
  seriousnessCodeSystem: 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness',
  seriousnessDisplayText: 'Serious',
  category: [{ code: 'product-use-error', system: 'http://terminology.hl7.org/CodeSystem/adverse-event-category' }],
  studyId: 'researchId-1',
  recordedDateTime: '1994-12-09',
  resolvedDate: '2021-12-09',
  seriousnessOutcome: {
    code: 'C113380',
    system: 'http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl',
    display: 'Disabling Adverse Event',
  },
  expectation: {
    code: 'C41333',
    system: 'http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl',
    display: 'Expected Adverse Event',
  },
  actor: 'practitioner-id',
  functionCode: {
    code: 'PART',
    system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
    display: 'Participation',
  },
};

describe('test Adverse Event template', () => {
  test('valid data passed into template should generate FHIR resource', () => {
    const generatedAdverseEvent = CTCAdverseEventTemplate(VALID_DATA);

    expect(generatedAdverseEvent).toEqual(maximalValidExampleAdverseEvent);

    // Commenting out for now as Practitioner resources are not extracted and thus
    // references in the Participation extension won't resolve
    // expect(isValidFHIR(generatedAdverseEvent)).toBeTruthy();
  });

  test('minimal data passed into template should generate FHIR resource', () => {
    const generatedAdverseEvent = CTCAdverseEventTemplate(MINIMAL_DATA);

    expect(generatedAdverseEvent).toEqual(minimalValidExampleAdverseEvent);
    expect(isValidFHIR(generatedAdverseEvent)).toBeTruthy();
  });

  test('missing non-required data should not throw an error', () => {
    const OPTIONAL_DATA = {
      id: 'adverseEventId-1',
      version: 'code-version',
      display: 'Anxiety disorder of childhood OR adolescence',
      text: 'event-text',
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

  test('Otherwise valid data including the functionCode but not an actor should throw an error', () => {
    delete VALID_DATA.actor;
    expect(() => CTCAdverseEventTemplate(VALID_DATA)).toThrow(Error);
  });
});
