const { isValidFHIR } = require('../utils');
const minimalStagingClinicalResource = require('./fixtures/minimal-staging-clinical-resource.json');
const minimalStagingPathologicResource = require('./fixtures/minimal-staging-pathologic-resource.json');
const maximalStagingResource = require('./fixtures/maximal-staging-resource.json');
const { stagingTemplate } = require('../../src/templates/StagingTemplate');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

describe('JavaScript render Staging template', () => {
  test('minimal clinical required data passed into template should generate FHIR resource', () => {
    const STAGING_CLINICAL_MINIMAL_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      effectiveDateTime: '2020-01-01',
      stageGroup: '3C',
      type: 'Clinical',
    };

    const generatedStaging = stagingTemplate(STAGING_CLINICAL_MINIMAL_DATA);
    expect(generatedStaging).toEqual(minimalStagingClinicalResource);
    expect(isValidFHIR(generatedStaging)).toBeTruthy();
  });

  test('minimal pathologic required data passed into template should generate FHIR resource', () => {
    const STAGING_CLINICAL_MINIMAL_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      effectiveDateTime: '2020-01-01',
      stageGroup: '3C',
      type: 'Pathologic',
    };

    const generatedStaging = stagingTemplate(STAGING_CLINICAL_MINIMAL_DATA);
    expect(generatedStaging).toEqual(minimalStagingPathologicResource);
    expect(isValidFHIR(generatedStaging)).toBeTruthy();
  });

  test('maximal data passed into template should generate FHIR resource', () => {
    const STAGING_MAXIMAL_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      effectiveDateTime: '2020-01-01',
      type: 'Clinical',
      stageGroup: '3C',
      categoryIds: ['t-category-id', 'n-category-id', 'm-category-id'],
    };

    const generatedStaging = stagingTemplate(STAGING_MAXIMAL_DATA);
    expect(generatedStaging).toEqual(maximalStagingResource);
    expect(isValidFHIR(generatedStaging)).toBeTruthy();
  });

  test('missing non-required data should not throw an error', () => {
    const NECESSARY_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      effectiveDateTime: '2020-01-01',
      stageGroup: '3C',
      type: 'Clinical',
    };

    const OPTIONAL_DATA = {
      categoryIds: ['t-category-id', 'n-category-id', 'm-category-id'],
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, stagingTemplate, NECESSARY_DATA);
  });

  test('missing required data should throw an error', () => {
    const INVALID_DATA = {
      // Omitting 'effectiveDateTime' field which is a required property
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      type: 'Clinical',
    };

    expect(() => stagingTemplate(INVALID_DATA)).toThrow(Error);
  });
});
