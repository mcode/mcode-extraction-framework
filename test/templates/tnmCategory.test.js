const { isValidFHIR } = require('../utils');
const tumorClinicalResource = require('./fixtures/tumor-category-clinical-resource.json');
const tumorPathologicResource = require('./fixtures/tumor-category-pathologic-resource.json');
const nodesClinicalResource = require('./fixtures/nodes-category-clinical-resource.json');
const nodesPathologicResource = require('./fixtures/nodes-category-pathologic-resource.json');
const metastasesClinicalResource = require('./fixtures/metastases-category-clinical-resource.json');
const metastasesPathologicResource = require('./fixtures/metastases-category-pathologic-resource.json');
const { tnmCategoryTemplate } = require('../../src/templates/TNMCategoryTemplate');

describe('JavaScript render TNMCategory template', () => {
  test('tumor clinical data passed into template should generate FHIR resource', () => {
    const TUMOR_CLINICAL_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      effectiveDateTime: '2020-01-01',
      valueCode: 'cT3',
      categoryType: 'Tumor',
      stageType: 'Clinical',
    };

    const generatedCategoryTemplate = tnmCategoryTemplate(TUMOR_CLINICAL_DATA);
    expect(generatedCategoryTemplate).toEqual(tumorClinicalResource);
    expect(isValidFHIR(generatedCategoryTemplate)).toBeTruthy();
  });

  test('tumor pathologic data passed into template should generate FHIR resource', () => {
    const TUMOR_PATHOLOGIC_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      effectiveDateTime: '2020-01-01',
      valueCode: 'pT3',
      categoryType: 'Tumor',
      stageType: 'Pathologic',
    };

    const generatedCategoryTemplate = tnmCategoryTemplate(TUMOR_PATHOLOGIC_DATA);
    expect(generatedCategoryTemplate).toEqual(tumorPathologicResource);
    expect(isValidFHIR(generatedCategoryTemplate)).toBeTruthy();
  });

  test('nodes clinical data passed into template should generate FHIR resource', () => {
    const NODES_CLINICAL_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      effectiveDateTime: '2020-01-01',
      valueCode: 'cN3',
      categoryType: 'Nodes',
      stageType: 'Clinical',
    };

    const generatedCategoryTemplate = tnmCategoryTemplate(NODES_CLINICAL_DATA);
    expect(generatedCategoryTemplate).toEqual(nodesClinicalResource);
    expect(isValidFHIR(generatedCategoryTemplate)).toBeTruthy();
  });

  test('nodes pathologic data passed into template should generate FHIR resource', () => {
    const NODES_PATHOLOGIC_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      effectiveDateTime: '2020-01-01',
      valueCode: 'pN3',
      categoryType: 'Nodes',
      stageType: 'Pathologic',
    };

    const generatedCategoryTemplate = tnmCategoryTemplate(NODES_PATHOLOGIC_DATA);
    expect(generatedCategoryTemplate).toEqual(nodesPathologicResource);
    expect(isValidFHIR(generatedCategoryTemplate)).toBeTruthy();
  });

  test('metastases clinical data passed into template should generate FHIR resource', () => {
    const METASTASES_CLINICAL_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      effectiveDateTime: '2020-01-01',
      valueCode: 'cM0',
      categoryType: 'Metastases',
      stageType: 'Clinical',
    };

    const generatedCategoryTemplate = tnmCategoryTemplate(METASTASES_CLINICAL_DATA);
    expect(generatedCategoryTemplate).toEqual(metastasesClinicalResource);
    expect(isValidFHIR(generatedCategoryTemplate)).toBeTruthy();
  });

  test('metastases pathologic data passed into template should generate FHIR resource', () => {
    const METASTASES_PATHOLOGIC_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      effectiveDateTime: '2020-01-01',
      valueCode: 'pM0',
      categoryType: 'Metastases',
      stageType: 'Pathologic',
    };

    const generatedCategoryTemplate = tnmCategoryTemplate(METASTASES_PATHOLOGIC_DATA);
    expect(generatedCategoryTemplate).toEqual(metastasesPathologicResource);
    expect(isValidFHIR(generatedCategoryTemplate)).toBeTruthy();
  });

  test('missing required data should throw an error', () => {
    const INVALID_DATA = {
      // Omitting 'effectiveDateTime' field which is a required property
      id: 'example-id',
      subjectId: 'example-mrn',
      conditionId: 'example-condition-id',
      valueCode: 'cT3',
      categoryType: 'Tumor',
      stageType: 'Clinical',
    };

    expect(() => tnmCategoryTemplate(INVALID_DATA)).toThrow(Error);
  });
});
