const moment = require('moment');
const { lowercaseLookupQuery } = require('./lookupUtils');
const {
  mcodeDiseaseStatusTextToCodeLookup,
  icareDiseaseStatusTextToCodeLookup,
  mcodeDiseaseStatusCodeToTextLookup,
  icareDiseaseStatusCodeToTextLookup,
  evidenceTextToCodeLookup,
  evidenceCodeToTextLookup,
} = require('./lookups/diseaseStatusLookup');

// Translate an M-language epoch date to an appropriate moment date
function mEpochToDate(date) {
  const epochDate = moment('1840-12-31');
  return epochDate.add(date, 'days');
}

/**
 * Converts Text Value to code in mCODE's ConditionStatusTrendVS
 * @param {string} text - limited to keys in the DiseaseStatusTextToCodeLookup's above
 * @return {code} corresponding DiseaseStatus code
 */
function getDiseaseStatusCode(text, implementation) {
  switch (implementation) {
    case 'icare':
      return lowercaseLookupQuery(text, icareDiseaseStatusTextToCodeLookup);
    default:
      return lowercaseLookupQuery(text, mcodeDiseaseStatusTextToCodeLookup);
  }
}

/**
 * Converts code in mCODE's ConditionStatusTrendVS to Text Value
 * @param {string} code - limited to keys in the DiseaseStatusCodeToTextLookup's above
 * @return {string} corresponding DiseaseStatus display text
 */
function getDiseaseStatusDisplay(code, implementation) {
  switch (implementation) {
    case 'icare':
      return lowercaseLookupQuery(code, icareDiseaseStatusCodeToTextLookup);
    default:
      return lowercaseLookupQuery(code, mcodeDiseaseStatusCodeToTextLookup);
  }
}

/**
 * Converts Text Value to code in mCODE's CancerDiseaseStatusEvidenceTypeVS
 * @param {string} text - limited to keys in the evidenceTextToCodeLookup
 * @return {string} corresponding Evidence code
 */
function getDiseaseStatusEvidenceCode(text) {
  return lowercaseLookupQuery(text, evidenceTextToCodeLookup);
}

/**
 * Converts code in mCODE's CancerDiseaseStatusEvidenceTypeVS to Text Value
 * @param {string} code - limited to keys in the evidenceTextToCodeLookup above
 * @return {string} corresponding Evidence display text
 */
function getDiseaseStatusEvidenceDisplay(code) {
  return lowercaseLookupQuery(code, evidenceCodeToTextLookup);
}

module.exports = {
  getDiseaseStatusCode,
  getDiseaseStatusDisplay,
  getDiseaseStatusEvidenceCode,
  getDiseaseStatusEvidenceDisplay,
  mEpochToDate,
};
