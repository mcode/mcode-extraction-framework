const path = require('path');
const { checkCodeInVs } = require('./valueSetUtils');


/**
 * Checks for ICD-10 code
 * @param condition fhir resource
 * @return {code} if condition has an ICD10 code
 */
function getICD10Code(condition) {
  if (condition && condition.code) {
    const { coding } = condition.code;

    if (coding && coding.length > 0) {
      return coding.find((c) => c.system === 'http://hl7.org/fhir/sid/icd-10-cm' || c.system === 'urn:oid:2.16.840.1.113883.6.90');
    }
  }
  return undefined;
}

/**
 * Checks if a condition code is a primary cancer condition
 * @param code ICD code, string
 * @return {boolean} if primary cancer condition
 */
function isConditionCodePrimary(code) {
  const primaryCancerConditionVSFilepath = path.resolve(__dirname, './valueSets/ValueSet-mcode-primary-or-uncertain-behavior-cancer-disorder-vs.json');
  return checkCodeInVs(code, primaryCancerConditionVSFilepath);
}

/**
 * Checks if a condition code is a secondary cancer condition
 * @param code ICD code, string
 * @return {boolean} if secondary cancer condition
 */
function isConditionCodeSecondary(code) {
  const secondaryCancerConditionVSFilepath = path.resolve(__dirname, './valueSets/ValueSet-mcode-secondary-cancer-disorder-vs.json');
  return checkCodeInVs(code, secondaryCancerConditionVSFilepath);
}

/**
 * Checks if a condition resource is a primary cancer condition
 * @param condition fhir resource
 * @return {boolean} if primary cancer condition
 */
function isConditionPrimary(condition) {
  const icd10Code = getICD10Code(condition);
  return icd10Code && isConditionCodePrimary(icd10Code.code);
}

/**
 * Checks if a condition resource is a secondary cancer condition
 * @param condition fhir resource
 * @return {boolean} if secondary cancer condition
 */
function isConditionSecondary(condition) {
  const icd10Code = getICD10Code(condition);
  return icd10Code && isConditionCodeSecondary(icd10Code.code);
}

/**
 * Checks if a condition code is a cancer condition we recognize
 * @param code ICD code, string
 * @return {boolean} if primary or secondary cancer condition
 */
function isConditionCodeCancer(code) {
  return isConditionCodePrimary(code) || isConditionCodeSecondary(code);
}

/**
 * Checks if a condition is a cancer condition we recognize
 * @param condition fhir resource
 * @return {boolean} if primary or secondary cancer condition
 */
function isConditionCancer(condition) {
  return isConditionPrimary(condition) || isConditionSecondary(condition);
}

module.exports = {
  getICD10Code,
  isConditionPrimary,
  isConditionSecondary,
  isConditionCodePrimary,
  isConditionCodeSecondary,
  isConditionCodeCancer,
  isConditionCancer,
};
