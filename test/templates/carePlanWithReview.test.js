const fs = require('fs');
const path = require('path');
const validCarePlanWithReview = require('./fixtures/careplan-resource.json');
const { renderTemplate } = require('../../src/helpers/ejsUtils');

const VALID_DATA = {
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

const INVALID_DATA = {
  // Omitting 'treatmentPlanChange' field which is required
  effectiveDateTime: '2020-01-23T09:07:00Z',
  effectiveDate: '2020-01-23',
  subject: {
    id: 'abc-def',
    name: 'Sample Text',
  },
};

const CARE_PLAN_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../src/templates/CarePlanWithReview.ejs'), 'utf8');

describe('test CarePlan template', () => {
  test('valid data passed into template should generate valid FHIR resource', () => {
    const generatedCarePlanWithReview = renderTemplate(
      CARE_PLAN_TEMPLATE,
      VALID_DATA,
    );

    // Relevant fields should match the valid FHIR
    expect(generatedCarePlanWithReview.status).toEqual(validCarePlanWithReview.status);
    expect(generatedCarePlanWithReview.intent).toEqual(validCarePlanWithReview.intent);
    expect(generatedCarePlanWithReview.created).toEqual(validCarePlanWithReview.created);
    expect(generatedCarePlanWithReview.subject).toEqual(validCarePlanWithReview.subject);
    expect(generatedCarePlanWithReview.extension).toHaveLength(1);
    expect(generatedCarePlanWithReview.extension).toEqual(validCarePlanWithReview.extension);
  });

  test('invalid data should throw a reference error', () => {
    expect(() => renderTemplate(
      CARE_PLAN_TEMPLATE,
      INVALID_DATA,
    )).toThrow(ReferenceError);
  });
});
