const {
  isVitalSign, getQuantityUnit, getQuantityCode, vitalSignsCodeToTextLookup, quantityCodeToUnitLookup,
} = require('../../src/helpers/observationUtils.js');

describe('observationUtils', () => {
  test('isVitalSign should return true when passed a valid Vital Sign code', () => {
    Object.keys(vitalSignsCodeToTextLookup).forEach((code) => {
      expect(isVitalSign(code)).toEqual(true);
    });
  });
  test('isVitalSign should return false when passed a code that does not belong to a Vital Sign', () => {
    const code = '12345';
    expect(isVitalSign(code)).toEqual(false);
  });
  test('getQuantityUnit should return the corresponding unit display value when passed a unit code', () => {
    Object.keys(quantityCodeToUnitLookup).forEach((unitCode) => {
      const unitText = quantityCodeToUnitLookup[unitCode];
      expect(getQuantityUnit(unitCode)).toEqual(unitText);
    });
  });
  test('getQuantityCode should return the corresponding unit code when passed a unit display value', () => {
    Object.keys(quantityCodeToUnitLookup).forEach((unitCode) => {
      const unitText = quantityCodeToUnitLookup[unitCode];
      expect(getQuantityCode(unitText)).toEqual(unitCode);
    });
  });
});
