const { invertObject } = require('./helperUtils');

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

// Unit codes and display values fo Vital Signs values
// Code mapping is based on http://hl7.org/fhir/R4/observation-vitalsigns.html
const quantityCodeToUnitLookup = {
  '/min': '/min',
  '%': '%',
  '[degF]': 'degF',
  '[in_i]': 'in',
  '[lb_av]': 'lb_av',
  'kg/m2': 'kg/m2',
  'mm[Hg]': 'mmHg',
  Cel: 'Cel',
  cm: 'cm',
  kg: 'kg',
  g: 'g',
};

const quantityTextToCodeLookup = invertObject(quantityCodeToUnitLookup);

function isVitalSign(code) {
  return Object.keys(vitalSignsCodeToTextLookup).includes(code);
}

function getQuantityUnit(unitCode) {
  if (!Object.keys(quantityCodeToUnitLookup).includes(unitCode)) {
    return null;
  }
  return quantityCodeToUnitLookup[unitCode];
}

function getQuantityCode(unitText) {
  return quantityTextToCodeLookup[unitText];
}

module.exports = {
  isVitalSign,
  getQuantityUnit,
  getQuantityCode,
  quantityCodeToUnitLookup,
  vitalSignsCodeToTextLookup,
};
