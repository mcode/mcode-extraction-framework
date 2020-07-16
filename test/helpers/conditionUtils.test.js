const {
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
const primaryCancerConditionVS = require('../../src/valueSets/ValueSet-onco-core-PrimaryOrUncertainBehaviorCancerDisorderVS.json');
const secondaryCancerConditionVS = require('../../src/valueSets/ValueSet-onco-core-SecondaryCancerDisorderVS.json');
const icd10 = require('./fixtures/icd10.json');

const primaryCancerConditionCode = primaryCancerConditionVS.compose.include[2].concept[0].code;
const secondaryCancerConditionCode = secondaryCancerConditionVS.compose.include[2].concept[0].code;

describe('conditionUtils', () => {
  test('isConditionCodePrimary', () => {
    expect(isConditionCodePrimary(primaryCancerConditionCode)).toBeTruthy();
    expect(isConditionCodePrimary('anything')).toBeFalsy();
    expect(() => isConditionCodePrimary(undefined)).toThrowError(TypeError);
  });

  test('isConditionCodeSecondary', () => {
    expect(isConditionCodeSecondary(secondaryCancerConditionCode)).toBeTruthy();
    expect(isConditionCodeSecondary('anyCode')).toBeFalsy();
    expect(() => isConditionCodeSecondary(undefined)).toThrowError(TypeError);
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
});
