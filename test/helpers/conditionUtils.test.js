const { isConditionPrimary, isConditionSecondary, getICD10Code } = require('../../src/helpers/conditionUtils');
const examplePrimaryCondition = require('./fixtures/primary-cancer-condition.json');
const exampleSecondaryCondition = require('./fixtures/secondary-cancer-condition.json');
const conditionWithICD10 = require('./fixtures/condition-with-icd10.json');
const conditionWithoutICD10 = require('./fixtures/condition-without-icd10.json');
const icd10 = require('./fixtures/icd10.json');

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
