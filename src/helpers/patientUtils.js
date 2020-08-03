// Based on the OMB Ethnicity table found here:http://hl7.org/fhir/us/core/STU3.1/ValueSet-omb-ethnicity-category.html
const ethnicityCodeToDisplay = {
  '2135-2': 'Hispanic or Latino',
  '2186-5': 'Non Hispanic or Latino',
};

/**
 * Converts code in OMB Ethnicity to Text Value
 * @param {string} code, coded ethinicity value from the above table
 * @return {string} display code from the OMB Ethnicity table
 */
function getEthnicityDisplay(code) {
  return ethnicityCodeToDisplay[code];
}


// Based on the OMB Race table found here: http://hl7.org/fhir/us/core/STU3.1/ValueSet-omb-race-category.html
const raceCodeToCodesystem = {
  '1002-5': 'urn:oid:2.16.840.1.113883.6.238',
  '2028-9': 'urn:oid:2.16.840.1.113883.6.238',
  '2054-5': 'urn:oid:2.16.840.1.113883.6.238',
  '2076-8': 'urn:oid:2.16.840.1.113883.6.238',
  '2106-3': 'urn:oid:2.16.840.1.113883.6.238',
  UNK: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
  ASKU: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
};

/**
 * Converts code in OMB Race to a codesystem value
 * @param {string} code, coded race value from the above table
 * @return {string} corresponding codesystem found in the OMB Race table f
 */
function getRaceCodesystem(code) {
  return raceCodeToCodesystem[code];
}


// Based on the OMB Race table found here: http://hl7.org/fhir/us/core/STU3.1/ValueSet-omb-race-category.html
const raceCodeToDisplay = {
  '1002-5': 'American Indian or Alaska Native',
  '2028-9': 'Asian',
  '2054-5': 'Black or African American',
  '2076-8': 'Native Hawaiian or Other Pacific Islander',
  '2106-3': 'White',
  UNK: 'Unknown Description: A proper value is applicable, but not known',
  ASKU: 'Asked but no answer',
};

/**
 * Converts code in OMB Race to a display value
 * @param {string} code, coded race value from the above table
 * @return {string} corresponding code from mCODE's ConditionStatusTrendVS
 */
function getRaceDisplay(code) {
  return raceCodeToDisplay[code];
}


/**
 * Turn a name object into a single name string
 * @param {Object} name object of the following shape: [{
 *   given: Array[String],
 *   ƒamily: String,
 * }]
 * @return {string} concatenated string of name values
 */
function getPatientName(name) {
  return `${name[0].given.join(' ')} ${name[0].family}`;
}

module.exports = {
  getEthnicityDisplay,
  getRaceCodesystem,
  getRaceDisplay,
  getPatientName,
};
