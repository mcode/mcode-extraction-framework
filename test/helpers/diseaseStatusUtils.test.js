const moment = require('moment');
const {
  getDiseaseStatusCode,
  getDiseaseStatusDisplay,
  getDiseaseStatusEvidenceCode,
  getDiseaseStatusEvidenceDisplay,
  mEpochToDate,
} = require('../../src/helpers/diseaseStatusUtils.js');

// Code mapping is based on http://standardhealthrecord.org/guides/icare/mapping_guidance.html
// specifically using lowercase versions of the text specified by ICARE for status
const diseaseStatusTextToCodeLookup = {
  'no evidence of disease': 260415000,
  responding: 268910001,
  stable: 359746009,
  progressing: 271299001,
  'not evaluated': 709137006,
};
// Code mapping is based on http://standardhealthrecord.org/guides/icare/mapping_guidance.html
// specifically using lowercase versions of the text specified by ICARE for Reason
const evidenceTextToCodeLookup = {
  imaging: 363679005,
  pathology: 252416005,
  symptoms: 711015009,
  'physical exam': 5880005,
  'lab results': 386344002,
};

describe('diseaseStatusUtils', () => {
  test('getDiseaseStatusCode,', () => {
    Object.keys(diseaseStatusTextToCodeLookup).forEach((dsText) => {
      const dsCode = diseaseStatusTextToCodeLookup[dsText];
      expect(getDiseaseStatusCode(dsText)).toEqual(dsCode);
    });
  });
  test('getDiseaseStatusDisplay,', () => {
    Object.keys(diseaseStatusTextToCodeLookup).forEach((dsText) => {
      const dsCode = diseaseStatusTextToCodeLookup[dsText];
      expect(getDiseaseStatusDisplay(dsCode)).toEqual(dsText);
    });
  });
  test('getDiseaseStatusEvidenceCode,', () => {
    Object.keys(evidenceTextToCodeLookup).forEach((evidenceText) => {
      const evidenceCode = evidenceTextToCodeLookup[evidenceText];
      expect(getDiseaseStatusEvidenceCode(evidenceText)).toEqual(evidenceCode);
    });
  });
  test('getDiseaseStatusEvidenceDisplay,', () => {
    Object.keys(evidenceTextToCodeLookup).forEach((evidenceText) => {
      const evidenceCode = evidenceTextToCodeLookup[evidenceText];
      expect(getDiseaseStatusEvidenceDisplay(evidenceCode)).toEqual(evidenceText);
    });
  });
  test('mEpochToDate,', () => {
    expect(mEpochToDate(1).format('YYYY-MM-DD')).toEqual('1841-01-01');
    expect(mEpochToDate(0).format('YYYY-MM-DD')).toEqual('1840-12-31');
  });
});
