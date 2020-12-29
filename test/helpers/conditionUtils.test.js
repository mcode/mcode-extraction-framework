const {
  isConditionCancer,
  isConditionCodeCancer,
  isConditionCodePrimary,
  isConditionCodeSecondary,
  isConditionPrimary,
  isConditionSecondary,
  getICD10Code,
} = require('../../src/helpers/conditionUtils');
const examplePrimaryCondition = require('./fixtures/primary-cancer-condition.json');
const exampleSecondaryCondition = require('./fixtures/secondary-cancer-condition.json');
const conditionWithICD10 = require('./fixtures/condition-with-icd10.json');
const conditionWithoutICD10 = require('./fixtures/condition-without-icd10.json');
const icd10 = require('./fixtures/icd10.json');

const icd10System = 'http://hl7.org/fhir/sid/icd-10-cm';
const primaryCancerConditionCode = 'C50.911'; // "Malignant neoplasm of unspecified site of right female breast"
const secondaryCancerConditionCode = 'C7B.1'; // "Secondary Merkel cell carcinoma" without a

describe('conditionUtils', () => {
  test('isConditionCodePrimary', () => {
    expect(isConditionCodePrimary(primaryCancerConditionCode, icd10System)).toBeTruthy();
    expect(isConditionCodePrimary('anything')).toBeFalsy();
    expect(isConditionCodePrimary(undefined)).toBeFalsy();
  });

  test('isConditionCodeSecondary', () => {
    expect(isConditionCodeSecondary(secondaryCancerConditionCode, icd10System)).toBeTruthy();
    expect(isConditionCodeSecondary('anyCode')).toBeFalsy();
    expect(isConditionCodeSecondary(undefined)).toBeFalsy();
  });

  test('isConditionPrimary', () => {
    expect(isConditionPrimary(examplePrimaryCondition)).toBeTruthy();
    expect(isConditionPrimary(exampleSecondaryCondition)).toBeFalsy();
    expect(isConditionPrimary(undefined)).toBeFalsy();
  });

  test('isConditionSecondary', () => {
    expect(isConditionSecondary(exampleSecondaryCondition)).toBeTruthy();
    expect(isConditionSecondary(examplePrimaryCondition)).toBeFalsy();
    expect(isConditionSecondary(undefined)).toBeFalsy();
  });

  test('getICD10Code', () => {
    expect(getICD10Code(conditionWithICD10)).toEqual(icd10);
    expect(getICD10Code(conditionWithoutICD10)).toBeUndefined();
  });

  test('isConditionCodeCancer', () => {
    expect(isConditionCodeCancer(primaryCancerConditionCode, icd10System)).toBeTruthy();
    expect(isConditionCodeCancer(secondaryCancerConditionCode, icd10System)).toBeTruthy();
    expect(isConditionCodeCancer('anything')).toBeFalsy();
    expect(isConditionCodeCancer(undefined)).toBeFalsy();
  });

  test('isConditionCancer', () => {
    expect(isConditionCancer(examplePrimaryCondition)).toBeTruthy();
    expect(isConditionCancer(exampleSecondaryCondition)).toBeTruthy();
    expect(isConditionCancer(undefined)).toBeFalsy();
  });
});
