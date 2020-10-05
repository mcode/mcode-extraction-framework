const minimalCarePlan = require('./fixtures/minimal-careplan-resource.json');
const maximalCarePlan = require('./fixtures/maximal-careplan-resource.json');
const { carePlanWithReviewTemplate } = require('../../src/templates');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

describe('JavaScript render CarePlan template', () => {
  test('minimal required data passed into template should generate FHIR resource', () => {
    const CARE_PLAN_VALID_DATA = {
      id: 'test-id',
      effectiveDateTime: '2020-01-23T09:07:00Z',
      effectiveDate: '2020-01-23',
      treatmentPlanChange: {
        hasChanged: 'false',
      },
      subject: {
        id: 'abc-def',
      },
    };

    const generatedCarePlan = carePlanWithReviewTemplate(CARE_PLAN_VALID_DATA);
    expect(generatedCarePlan).toEqual(minimalCarePlan);
  });

  test('maximal data passed into template should generate FHIR resource', () => {
    const MAX_CARE_PLAN_DATA = {
      id: 'test-id',
      effectiveDateTime: '2020-01-23T09:07:00Z',
      effectiveDate: '2020-01-23',
      treatmentPlanChange: {
        hasChanged: 'true',
        reason: {
          code: '281647001',
          displayText: 'Adverse reaction (disorder)',
        },
      },
      subject: {
        id: 'abc-def',
        name: 'Sample Text',
      },
    };

    const generatedCarePlan = carePlanWithReviewTemplate(MAX_CARE_PLAN_DATA);
    expect(generatedCarePlan).toEqual(maximalCarePlan);
  });

  test('missing non-required data should not throw an error', () => {
    const NECESSARY_DATA = {
      id: 'test-id',
      effectiveDateTime: '2020-01-23T09:07:00Z',
      effectiveDate: '2020-01-23',
      treatmentPlanChange: {
        hasChanged: 'false',
      },
      subject: {
        id: 'abc-def',
      },
    };

    const OPTIONAL_DATA = {
      treatmentPlanChange: { // overwrite treatmentPlanChange including optional property
        hasChanged: 'true',
        reason: {
          code: '281647001',
          displayText: 'Adverse reaction (disorder)',
        },
      },
      subject: { // overwrite subject including optional property
        id: 'abc-def',
        name: 'Sample Text',
      },
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, carePlanWithReviewTemplate, NECESSARY_DATA);
  });

  test('missing required data should throw a reference error', () => {
    const INVALID_DATA = {
      // Omitting 'treatmentPlanChange' field which has a required property
      effectiveDateTime: '2020-01-23T09:07:00Z',
      effectiveDate: '2020-01-23',
      subject: {
        id: 'abc-def',
        name: 'Sample Text',
      },
    };

    expect(() => carePlanWithReviewTemplate(INVALID_DATA)).toThrow(Error);
  });
});
