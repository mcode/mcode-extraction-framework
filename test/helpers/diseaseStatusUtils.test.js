const diseaseStatusUtils = require('../../src/helpers/diseaseStatusUtils.js');

// Code mapping is based on http://standardhealthrecord.org/guides/icare/mapping_guidance.html
const diseaseStatusTextToCodeLookup = {
  'no evidence of disease': 260415000,
  responding: 268910001,
  stable: 359746009,
  progressing: 271299001,
  'not evaluated': 709137006,
};
// Code mapping is based on http://hl7.org/fhir/us/mcode/ValueSet-mcode-cancer-disease-status-evidence-type-vs.html
const evidenceTextToCodeLookup = {
  Imaging: 363679005,
  'Histopathology test': 252416005,
  'Assessment of symptom control': 711015009,
  'Physical examination procedure': 5880005,
  'Laboratory data interpretation': 386344002,
};

describe('diseaseStatusUtils', () => {
  test('getDiseaseStatusCode,', () => {
    Object.keys(diseaseStatusTextToCodeLookup).forEach((dsText) => {
      const dsCode = diseaseStatusTextToCodeLookup[dsText];
      expect(diseaseStatusUtils.getDiseaseStatusCode(dsText)).toEqual(dsCode);
    });
  });
  test('getDiseaseStatusDisplay,', () => {
    Object.keys(diseaseStatusTextToCodeLookup).forEach((dsText) => {
      const dsCode = diseaseStatusTextToCodeLookup[dsText];
      expect(diseaseStatusUtils.getDiseaseStatusDisplay(dsCode)).toEqual(dsText);
    });
  });
  test('getDiseaseStatusEvidenceCode,', () => {
    Object.keys(evidenceTextToCodeLookup).forEach((evidenceText) => {
      const evidenceCode = evidenceTextToCodeLookup[evidenceText];
      expect(diseaseStatusUtils.getDiseaseStatusEvidenceCode(evidenceText)).toEqual(evidenceCode);
    });
  });
  test('getDiseaseStatusEvidenceDisplay,', () => {
    Object.keys(evidenceTextToCodeLookup).forEach((evidenceText) => {
      const evidenceCode = evidenceTextToCodeLookup[evidenceText];
      expect(diseaseStatusUtils.getDiseaseStatusEvidenceDisplay(evidenceCode)).toEqual(evidenceText);
    });
  });
});
