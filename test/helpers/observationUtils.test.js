const {
  isVitalSign, isTumorMarker, isKarnofskyPerformanceStatus, isECOGPerformanceStatus, vitalSignsCodeToTextLookup,
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
  test('isTumorMarker should return true when passed a valid Tumor marker code', () => {
    const her2InTissue = '48676-1';
    expect(isTumorMarker(her2InTissue)).toEqual(true);
  });
  test('isTumorMarker should return false when passed a code that does not belong to a Tumor Marker', () => {
    const code = '12345';
    expect(isTumorMarker(code)).toEqual(false);
  });
  test('isKarnofskyPerformanceStatus should return true when passed the correct code', () => {
    const code = '89243-0';
    expect(isKarnofskyPerformanceStatus(code)).toEqual(true);
  });
  test('isKarnofskyPerformanceStatus should return false when passed an incorrect code', () => {
    const code = '12345';
    expect(isKarnofskyPerformanceStatus(code)).toEqual(false);
  });
  test('isECOGPerformanceStatus should return true when passed the correct code', () => {
    const code = '89247-1';
    expect(isECOGPerformanceStatus(code)).toEqual(true);
  });
  test('isECOGPerformanceStatus should return false when passed an incorrect code', () => {
    const code = '12345';
    expect(isECOGPerformanceStatus(code)).toEqual(false);
  });
});
