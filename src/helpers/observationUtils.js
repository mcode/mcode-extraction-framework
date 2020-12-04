const { checkCodeInVS } = require('./valueSetUtils');

// Codes and display values for Vital Signs resources
// Code mapping is based on http://hl7.org/fhir/R4/observation-vitalsigns.html
const vitalSignsCodeToTextLookup = {
  '85353-1': 'Vital Signs Panel',
  '9279-1': 'Respiratory Rate',
  '8867-4': 'Heart rate',
  '2708-6': 'Oxygen saturation',
  '8310-5': 'Body temperature',
  '8302-2': 'Body height',
  '9843-4': 'Head circumference',
  '29463-7': 'Body weight',
  '39156-5': 'Body mass index',
  '85354-9': 'Blood pressure systolic and diastolic',
  '8480-6': 'Systolic blood pressure',
  '8462-4': 'Diastolic blood pressure',
};


function isTumorMarker(code) {
  const tumorMarkerTestVSPath = './valueSets/ValueSet-mcode-tumor-marker-test-vs.json';
  return checkCodeInVS(code, tumorMarkerTestVSPath);
}

function isVitalSign(code) {
  return Object.keys(vitalSignsCodeToTextLookup).includes(code);
}

function isKarnofskyPerformanceStatus(code) {
  return code === '89243-0';
}

function isECOGPerformanceStatus(code) {
  return code === '89247-1';
}

module.exports = {
  isTumorMarker,
  isVitalSign,
  isKarnofskyPerformanceStatus,
  isECOGPerformanceStatus,
  vitalSignsCodeToTextLookup,
};
