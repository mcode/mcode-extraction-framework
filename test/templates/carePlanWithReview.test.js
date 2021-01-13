const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const minimalCarePlan = require('./fixtures/minimal-careplan-resource.json');
const maximalCarePlan = require('./fixtures/maximal-careplan-resource.json');
const { carePlanWithReviewTemplate } = require('../../src/templates/CarePlanWithReviewTemplate');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

describe('JavaScript render CarePlan template', () => {
  test('minimal required data passed into template should generate FHIR resource', () => {
    const CARE_PLAN_VALID_DATA = {
      id: 'test-id',
      mrn: 'abc-def',
      name: null,
      reviews: [
        {
          effectiveDate: '2020-01-23',
          hasChanged: 'false',
          reasonCode: null,
          reasonDisplayText: null,
        },
      ],
    };

    const generatedCarePlan = carePlanWithReviewTemplate(CARE_PLAN_VALID_DATA);
    expect(generatedCarePlan).toEqual(minimalCarePlan);
    expect(isValidFHIR(generatedCarePlan)).toBeTruthy();
  });

  test('maximal data passed into template should generate FHIR resource', () => {
    const MAX_CARE_PLAN_DATA = {
      id: 'test-id',
      mrn: 'abc-def',
      name: 'Sample Text',
      reviews: [
        {
          effectiveDate: '2020-01-23',
          hasChanged: 'true',
          reasonCode: '281647001',
          reasonDisplayText: 'Adverse reaction (disorder)',
        },
        {
          effectiveDate: '2020-01-30',
          hasChanged: 'true',
          reasonCode: '405613005',
          reasonDisplayText: 'Planned Procedure (situation)',
        },
      ],
    };

    const generatedCarePlan = carePlanWithReviewTemplate(MAX_CARE_PLAN_DATA);
    expect(generatedCarePlan).toEqual(maximalCarePlan);
    expect(isValidFHIR(generatedCarePlan)).toBeTruthy();
  });

  test('missing non-required data at care plan object level should not throw an error', () => {
    const NECESSARY_DATA = {
      id: 'test-id',
      mrn: 'abc-def',
      reviews: [],
    };

    const OPTIONAL_DATA = {
      name: 'Sample Text',
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, carePlanWithReviewTemplate, NECESSARY_DATA);
  });

  test('missing non-required data at review object level should not throw an error', () => {
    const NECESSARY_DATA = {
      id: 'test-id',
      mrn: 'abc-def',
      reviews: [
        {
          effectiveDate: '2020-01-23',
          hasChanged: 'false',
        },
      ],
    };

    const OPTIONAL_DATA = ['reasonCode', 'reasonDisplayText'];

    // Test presence of each optional key individually
    OPTIONAL_DATA.forEach((key) => {
      const r = NECESSARY_DATA.reviews[0];
      r[key] = 'sample value';

      expect(() => carePlanWithReviewTemplate(NECESSARY_DATA)).not.toThrow();

      delete r[key];
    });
  });

  test('missing required data should throw a reference error', () => {
    const INVALID_DATA = {
      // omitting 'mrn' field which is a required property
      id: 'test-id',
      reviews: [],
    };

    const INVALID_REVIEW_DATA = {
      // Omitting 'hasChanged' field on the review which is a required property
      id: 'test-id',
      mrn: 'abc-def',
      reviews: [{
        effectiveDate: '2020-01-23',
        haschanged: null,
      }],
    };

    expect(() => carePlanWithReviewTemplate(INVALID_DATA)).toThrow(Error);
    expect(() => carePlanWithReviewTemplate(INVALID_REVIEW_DATA)).toThrow(Error);
  });
});
