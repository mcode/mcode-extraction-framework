const { isValidFHIR } = require('../../src/helpers/fhirUtils');
const maximalProcedure = require('./fixtures/maximal-procedure-resource.json');
const minimalProcedure = require('./fixtures/minimal-procedure-resource.json');
const { procedureTemplate } = require('../../src/templates/ProcedureTemplate');
const { allOptionalKeyCombinationsNotThrow } = require('../utils');

describe('JavaScript render Procedure template', () => {
  test('minimal required data passed into template should generate FHIR resource', () => {
    const PROCEDURE_MINIMAL_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      effectiveDateTime: '2020-01-01',
      status: 'completed',
      code: '152198000',
      system: 'http://snomed.info/sct',
      display: null,
      reasonCode: null,
      reasonCodeSystem: null,
      reasonDisplayName: null,
      conditionId: null,
      bodySite: null,
      laterality: null,
      treatmentIntent: null,
    };

    const generatedProcedure = procedureTemplate(PROCEDURE_MINIMAL_DATA);
    expect(generatedProcedure).toEqual(minimalProcedure);
    expect(isValidFHIR(generatedProcedure)).toBeTruthy();
  });

  test('maximal data passed into template should generate FHIR resource', () => {
    const PROCEDURE_MAXIMAL_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      effectiveDateTime: '2020-01-01',
      status: 'completed',
      code: '152198000',
      system: 'http://snomed.info/sct',
      display: 'Brachytherapy (procedure)',
      reasonCode: '363346000',
      reasonCodeSystem: 'http://snomed.info/sct',
      reasonDisplayName: 'Malignant tumor',
      conditionId: 'example-condition-id',
      bodySite: '41224006',
      laterality: '51440002',
      treatmentIntent: '373808002',
    };

    const generatedProcedure = procedureTemplate(PROCEDURE_MAXIMAL_DATA);
    expect(generatedProcedure).toEqual(maximalProcedure);
    expect(isValidFHIR(generatedProcedure)).toBeTruthy();
  });

  test('missing non-required data should not throw an error', () => {
    const NECESSARY_DATA = {
      id: 'example-id',
      subjectId: 'example-mrn',
      effectiveDateTime: '2020-01-01',
      status: 'completed',
      code: '152198000',
      system: 'http://snomed.info/sct',
    };

    const OPTIONAL_DATA = {
      display: 'Brachytherapy (procedure)',
      reasonCode: '363346000',
      reasonCodeSystem: 'http://snomed.info/sct',
      reasonDisplayName: 'Malignant tumor',
      conditionId: 'example-condition-id',
      bodySite: '41224006',
      laterality: '51440002',
      treatmentIntent: '373808002',
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, procedureTemplate, NECESSARY_DATA);
  });

  test('missing required data should throw a reference error', () => {
    const INVALID_DATA = {
      // Omitting 'status' field which is a required property
      id: 'example-id',
      subjectId: 'example-mrn',
      effectiveDateTime: '2020-01-01',
      code: '152198000',
      system: 'http://snomed.info/sct',
      status: null,
    };

    expect(() => procedureTemplate(INVALID_DATA)).toThrow(Error);
  });
});
