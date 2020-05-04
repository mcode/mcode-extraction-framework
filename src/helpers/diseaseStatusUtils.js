// Code mapping is based on http://standardhealthrecord.org/guides/icare/mapping_guidance.html
const diseaseStatusTextToCodeLookup = {
  'no evidence of disease': 260415000,
  responding: 268910001,
  stable: 359746009,
  progressing: 271299001,
  'not evaluated': 709137006,
};

/**
 * Converts Text Value to code in mCODE's ConditionStatusTrendVS
 * @param text, limited to No evidence of disease, Responding, Stable, Progressing, or not evaluated
 * @return {code} corresponding code from mCODE's ConditionStatusTrendVS
 */
function getDiseaseStatusCode(text) {
  return diseaseStatusTextToCodeLookup[text];
}

module.exports = {
  getDiseaseStatusCode,
};
