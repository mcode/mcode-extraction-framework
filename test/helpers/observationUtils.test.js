const {
  isVitalSign,
  getQuantityUnit,
  getQuantityCode,
} = require('../../src/helpers/observationUtils.js');

// Codes and display values for Vital Signs resources
// Code mapping is based on http://hl7.org/fhir/R4/observation-vitalsigns.html
const vitalSignsCodeToTextLookup = {
  '85353-1': 'Vital Signs Panel',
  '9279-1': 'Repiratory Rate',
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
// Code mapping is based on http://unitsofmeasure.org
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

describe('observationUtils', () => {
  test('isVitalSign,', () => {
    Object.keys(vitalSignsCodeToTextLookup).forEach((code) => {
      expect(isVitalSign(code)).toEqual(true);
    });
  });
  test('isVitalSign,', () => {
    let code = '12345';
    expect(isVitalSign(code)).toEqual(false);
  });
  test('getQuantityUnit,', () => {
    Object.keys(quantityCodeToUnitLookup).forEach((unitCode) =>  {
      const unitText = quantityCodeToUnitLookup[unitCode];
      expect(getQuantityUnit(unitCode)).toEqual(unitText);
    });
  });
  test('getQuantityCode,', () => {
    Object.keys(quantityCodeToUnitLookup).forEach((unitCode) =>  {
      const unitText = quantityCodeToUnitLookup[unitCode];
      expect(getQuantityCode(unitText)).toEqual(unitCode);
    });
  });
});