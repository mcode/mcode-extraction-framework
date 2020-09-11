/* eslint-disable no-else-return */
const moment = require('moment');
const { invertObject } = require('./helperUtils');

// Translate an M-language epoch date to an appropriate moment date
function mEpochToDate(date) {
  const epochDate = moment('1840-12-31');
  return epochDate.add(date, 'days');
}

// Code mapping is based on current values at http://standardhealthrecord.org/guides/icare/mapping_guidance.html
const currentDiseaseStatusTextToCodeLookup = {
  'Not detected (qualifier)': 260415000,
  'Patient condition improved (finding)': 268910001,
  'Patient\'s condition stable (finding)': 359746009,
  'Patient\'s condition worsened (finding)': 271299001,
  'Patient condition undetermined (finding)': 709137006,
};
const currentDiseaseStatusCodeToTextLookup = invertObject(currentDiseaseStatusTextToCodeLookup);

// Code mapping is based on initial values still in use by icare implementors
// specifically using lowercase versions of the text specified by ICARE for status
const icareDiseaseStatusTextToCodeLookup = {
  'no evidence of disease': 260415000,
  responding: 268910001,
  stable: 359746009,
  progressing: 271299001,
  'not evaluated': 709137006,
};
const icareDiseaseStatusCodeToTextLookup = invertObject(icareDiseaseStatusTextToCodeLookup);

// Code mapping is based on http://standardhealthrecord.org/guides/icare/mapping_guidance.html
// specifically using lowercase versions of the text specified by ICARE for Reason
const evidenceTextToCodeLookup = {
  imaging: 363679005,
  pathology: 252416005,
  symptoms: 711015009,
  'physical exam': 5880005,
  'lab results': 386344002,
};
const evidenceCodeToTextLookup = invertObject(evidenceTextToCodeLookup);

/**
 * Converts Text Value to code in mCODE's ConditionStatusTrendVS
 * @param {string} text, limited to 'no evidence of disease', Responding, Stable, Progressing, or 'not evaluated'
 * @return {code} corresponding DiseaseStatus code
 */
function getDiseaseStatusCode(text, implementation = 'icare') {
  if (implementation === 'icare') {
    return icareDiseaseStatusTextToCodeLookup[text];
  } else {
    return currentDiseaseStatusTextToCodeLookup[text];
  }
}

/**
 * Converts code in mCODE's ConditionStatusTrendVS to Text Value
 * @param {string} code - limited to codes in the diseaseStatusTextToCodeLookup above
 * @return {string} corresponding DiseaseStatus display text
 */
function getDiseaseStatusDisplay(code, implementation = 'icare') {
  if (implementation === 'icare') {
    return icareDiseaseStatusCodeToTextLookup[code];
  } else {
    return currentDiseaseStatusCodeToTextLookup[code];
  }
}

/**
 * Converts Text Value to code in mCODE's CancerDiseaseStatusEvidenceTypeVS
 * @param {string} text - limited to imaging, pathology, symptoms, 'physical exam', 'lab results'
 * @return {string} corresponding Evidence code
 */
function getDiseaseStatusEvidenceCode(text) {
  return evidenceTextToCodeLookup[text];
}

/**
 * Converts code in mCODE's CancerDiseaseStatusEvidenceTypeVS to Text Value
 * @param {string} code - limited to codes in the evidenceTextToCodeLookup above
 * @return {string} corresponding Evidence display text
 */
function getDiseaseStatusEvidenceDisplay(code) {
  return evidenceCodeToTextLookup[code];
}

module.exports = {
  getDiseaseStatusCode,
  getDiseaseStatusDisplay,
  getDiseaseStatusEvidenceCode,
  getDiseaseStatusEvidenceDisplay,
  mEpochToDate,
};
