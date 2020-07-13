// Helper function for inverting a object's keys and values s.t. (k->v) becomes (v->k)
function invert(obj) {
  return Object.entries(obj).reduce((ret, entry) => {
    const [key, value] = entry;
    // eslint-disable-next-line no-param-reassign
    ret[value] = key;
    return ret;
  }, {});
}

// Code mapping is based on http://standardhealthrecord.org/guides/icare/mapping_guidance.html
// specifically using lowercase versions of the text specified by ICARE for status
const diseaseStatusTextToCodeLookup = {
  'no evidence of disease': 260415000,
  responding: 268910001,
  stable: 359746009,
  progressing: 271299001,
  'not evaluated': 709137006,
};
const diseaseStatusCodeToTextLookup = invert(diseaseStatusTextToCodeLookup);

// Code mapping is based on http://standardhealthrecord.org/guides/icare/mapping_guidance.html
// specifically using lowercase versions of the text specified by ICARE for Reason
const evidenceTextToCodeLookup = {
  imaging: 363679005,
  pathology: 252416005,
  symptoms: 711015009,
  'physical exam': 5880005,
  'lab results': 386344002,
};
const evidenceCodeToTextLookup = invert(evidenceTextToCodeLookup);

/**
 * Converts Text Value to code in mCODE's ConditionStatusTrendVS
 * @param text, limited to No evidence of disease, Responding, Stable, Progressing, or not evaluated
 * @return {code} corresponding code from mCODE's ConditionStatusTrendVS
 */
function getDiseaseStatusCode(text) {
  return diseaseStatusTextToCodeLookup[text];
}

/**
 * Converts code in mCODE's ConditionStatusTrendVS to Text Value
 * @param text, limited to No evidence of disease, Responding, Stable, Progressing, or not evaluated
 * @return {code} corresponding code from mCODE's ConditionStatusTrendVS
 */
function getDiseaseStatusDisplay(code) {
  return diseaseStatusCodeToTextLookup[code];
}

/**
 * Converts Text Value to code in mCODE's CancerDiseaseStatusEvidenceTypeVS
 * @param text, limited to No evidence of disease, Responding, Stable, Progressing, or not evaluated
 * @return {code} corresponding code from mCODE's CancerDiseaseStatusEvidenceTypeVS
 */
function getDiseaseStatusEvidenceCode(text) {
  return evidenceTextToCodeLookup[text];
}

/**
 * Converts code in mCODE's CancerDiseaseStatusEvidenceTypeVS to Text Value
 * @param text, limited to No evidence of disease, Responding, Stable, Progressing, or not evaluated
 * @return {code} corresponding code from mCODE's CancerDiseaseStatusEvidenceTypeVS
 */
function getDiseaseStatusEvidenceDisplay(code) {
  return evidenceCodeToTextLookup[code];
}

module.exports = {
  getDiseaseStatusCode,
  getDiseaseStatusDisplay,
  getDiseaseStatusEvidenceCode,
  getDiseaseStatusEvidenceDisplay,
};
