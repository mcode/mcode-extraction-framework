const primaryCancerConditionVS = require('../valueSets/ValueSet-onco-core-PrimaryOrUncertainBehaviorCancerDisorderVS.json');
const secondaryCancerConditionVS = require('../valueSets/ValueSet-onco-core-SecondaryCancerDisorderVS.json');

function checkCodeInVS(code, valueSet) {
  // strips the period in the code since the provided value set has the periods removed
  return valueSet.compose.include[2].concept.map((c) => c.code).includes(code.replace('.', ''));
}

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


// Checks if condition's ICD10 code is in valueset
function checkConditionInVS(condition, vs) {
  const icd10Code = getICD10Code(condition);
  return icd10Code && checkCodeInVS(icd10Code.code, vs);
}

/**
 * Checks if a condition resource is a primary cancer condition
 * @param condition fhir resource
 * @return {boolean} if primary cancer condition
 */
function isConditionPrimary(condition) {
  return checkConditionInVS(condition, primaryCancerConditionVS);
}

/**
 * Checks if a condition resource is a primary cancer condition
 * @param condition fhir resource
 * @return {boolean} if secondary cancer condition
 */
function isConditionSecondary(condition) {
  return checkConditionInVS(condition, secondaryCancerConditionVS);
}

module.exports = {
  getICD10Code,
  isConditionPrimary,
  isConditionSecondary,
};
