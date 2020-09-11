const {
  getDiseaseStatusCode,
  getDiseaseStatusDisplay,
  getDiseaseStatusEvidenceCode,
  getDiseaseStatusEvidenceDisplay,
  mEpochToDate,
} = require('../../src/helpers/diseaseStatusUtils.js');

// Code mapping is based on http://standardhealthrecord.org/guides/icare/mapping_guidance.html
// specifically using lowercase versions of the text specified by ICARE for status
const currentDiseaseStatusTextToCodeLookup = {
  'Not detected (qualifier)': 260415000,
  'Patient condition improved (finding)': 268910001,
  'Patient\'s condition stable (finding)': 359746009,
  'Patient\'s condition worsened (finding)': 271299001,
  'Patient condition undetermined (finding)': 709137006,
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
    Object.keys(currentDiseaseStatusTextToCodeLookup).forEach((dsText) => {
      const dsCode = currentDiseaseStatusTextToCodeLookup[dsText];
      expect(getDiseaseStatusCode(dsText, 'mcode')).toEqual(dsCode);
    });
  });
  test('getDiseaseStatusDisplay,', () => {
    Object.keys(currentDiseaseStatusTextToCodeLookup).forEach((dsText) => {
      const dsCode = currentDiseaseStatusTextToCodeLookup[dsText];
      expect(getDiseaseStatusDisplay(dsCode, 'mcode')).toEqual(dsText);
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
