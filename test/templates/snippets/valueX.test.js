const { valueX } = require('../../../src/templates/snippets');

describe('valueX snippet', () => {
  test('Should generate valueCodeableConcept when type parameter is used', () => {
    const exampleCode = { system: 'exampleSystem', code: 'exampleCode', display: 'Example Display' };
    const exampleCodeableConcept = {
      valueCodeableConcept: {
        coding: [
          {
            system: 'exampleSystem',
            code: 'exampleCode',
            display: 'Example Display',
          },
        ],
      },
    };
    expect(valueX(exampleCode, 'valueCodeableConcept')).toEqual(exampleCodeableConcept);
  });

  test('Should generate valueInteger when type parameter is used', () => {
    const exampleInt = 17;
    const exampleValueInt = {
      valueInteger: 17,
    };
    expect(valueX(exampleInt, 'valueInteger')).toEqual(exampleValueInt);
  });

  test('Should generate valueInteger when type parameter is not used', () => {
    const exampleInt = 17;
    const exampleValueInt = {
      valueInteger: 17,
    };
    expect(valueX(exampleInt)).toEqual(exampleValueInt);
  });

  test('Should generate valueDecimal when type parameter is used', () => {
    const exampleNumber = 17;
    const exampleValueDecimal = {
      valueDecimal: 17,
    };
    expect(valueX(exampleNumber, 'valueDecimal')).toEqual(exampleValueDecimal);
  });

  test('Should generate valueBoolean when type parameter is used', () => {
    const exampleBool = true;
    const exampleValueBool = {
      valueBoolean: true,
    };
    expect(valueX(exampleBool, 'valueBoolean')).toEqual(exampleValueBool);
  });

  test('Should generate valueBoolean when type parameter is not used', () => {
    const exampleBool = true;
    const exampleValueBool = {
      valueBoolean: true,
    };
    expect(valueX(exampleBool)).toEqual(exampleValueBool);
  });

  test('Should generate valueDate when type parameter is used', () => {
    const exampleDate = '2020-02-01';
    const exampleValueDate = {
      valueDate: '2020-02-01',
    };
    expect(valueX(exampleDate, 'valueDate')).toEqual(exampleValueDate);
  });

  test('Should generate valueDate when type parameter is not used', () => {
    const exampleDate = '2020-02-01';
    const exampleValueDate = {
      valueDate: '2020-02-01',
    };
    expect(valueX(exampleDate)).toEqual(exampleValueDate);
  });

  test('Should generate valueDateTime when type parameter is used', () => {
    const exampleDateTime = '2020-02-01';
    const exampleValueDateTime = {
      valueDateTime: '2020-02-01',
    };
    expect(valueX(exampleDateTime, 'valueDateTime')).toEqual(exampleValueDateTime);
  });

  test('Should generate valueDateTime when type parameter is not used', () => {
    const exampleDateTime = '2020-02-01T10:35:59';
    const exampleValueDateTime = {
      valueDateTime: '2020-02-01T10:35:59',
    };
    expect(valueX(exampleDateTime)).toEqual(exampleValueDateTime);
  });

  test('Should generate valueTime when type parameter is used', () => {
    const exampconstime = '10:35:59';
    const exampleValueTime = {
      valueTime: '10:35:59',
    };
    expect(valueX(exampconstime, 'valueTime')).toEqual(exampleValueTime);
  });

  test('Should generate valueTime when type parameter is not used', () => {
    const exampconstime = '10:35:59';
    const exampleValueTime = {
      valueTime: '10:35:59',
    };
    expect(valueX(exampconstime)).toEqual(exampleValueTime);
  });

  test('Should generate valueQuantity from object when type parameter is used', () => {
    const exampleObj = { value: 'exampleValue', code: 'exampleCode', unit: 'Example Unit' };
    const exampleQuantity = {
      valueQuantity: {
        value: 'exampleValue',
        code: 'exampleCode',
        unit: 'Example Unit',
        system: 'http://unitsofmeasure.org',
      },
    };
    expect(valueX(exampleObj, 'valueQuantity')).toEqual(exampleQuantity);
  });

  test('Should generate valueQuantity from object when type parameter is not used', () => {
    const exampleObj = { value: 'exampleValue', code: 'exampleCode', unit: 'Example Unit' };
    const exampleQuantity = {
      valueQuantity: {
        value: 'exampleValue',
        code: 'exampleCode',
        unit: 'Example Unit',
        system: 'http://unitsofmeasure.org',
      },
    };
    expect(valueX(exampleObj)).toEqual(exampleQuantity);
  });

  test('Should generate valueQuantity from string when type parameter is used', () => {
    const exampleString = '66.89 [in_i]';
    const exampleQuantity = {
      valueQuantity: {
        value: 66.89,
        code: '[in_i]',
        unit: 'in',
        system: 'http://unitsofmeasure.org',
      },
    };
    expect(valueX(exampleString, 'valueQuantity')).toEqual(exampleQuantity);
  });

  test('Should generate valueQuantity from string when type parameter is not used', () => {
    const exampleString = '66.89 [in_i]';
    const exampleQuantity = {
      valueQuantity: {
        value: 66.89,
        code: '[in_i]',
        unit: 'in',
        system: 'http://unitsofmeasure.org',
      },
    };
    expect(valueX(exampleString)).toEqual(exampleQuantity);
  });

  test('Should generate valueString when type parameter is used', () => {
    const exampleString = 'Hello!';
    const exampleValueString = {
      valueString: 'Hello!',
    };
    expect(valueX(exampleString, 'valueString')).toEqual(exampleValueString);
  });

  test('Should generate valueString when type parameter is not used', () => {
    const exampleString = 'Hello!';
    const exampleValueString = {
      valueString: 'Hello!',
    };
    expect(valueX(exampleString)).toEqual(exampleValueString);
  });

  test('Should generate valueRange from object when type parameter is used', () => {
    const exampleObj = { high: 19, low: 15 };
    const exampleRange = {
      valueRange: {
        high: 19,
        low: 15,
      },
    };
    expect(valueX(exampleObj, 'valueRange')).toEqual(exampleRange);
  });

  test('Should generate valueRange from object when type parameter is not used', () => {
    const exampleObj = { high: 19, low: 15 };
    const exampleRange = {
      valueRange: {
        high: 19,
        low: 15,
      },
    };
    expect(valueX(exampleObj)).toEqual(exampleRange);
  });

  test('Should generate valuePeriod from object when type parameter is used', () => {
    const exampleObj = { start: '2020-01-01', end: '20202-02-02' };
    const examplePeriod = {
      valuePeriod: {
        start: '2020-01-01',
        end: '20202-02-02',
      },
    };
    expect(valueX(exampleObj, 'valuePeriod')).toEqual(examplePeriod);
  });

  test('Should generate valuePeriod from object when type parameter is not used', () => {
    const exampleObj = { start: '2020-01-01', end: '20202-02-02' };
    const examplePeriod = {
      valuePeriod: {
        start: '2020-01-01',
        end: '20202-02-02',
      },
    };
    expect(valueX(exampleObj)).toEqual(examplePeriod);
  });

  test('Should generate valueCoding when type parameter is used', () => {
    const exampleCode = { system: 'exampleSystem', code: 'exampleCode', display: 'Example Display' };
    const exampleValueCoding = {
      valueCoding: {
        system: 'exampleSystem',
        code: 'exampleCode',
        display: 'Example Display',
      },
    };
    expect(valueX(exampleCode, 'valueCoding')).toEqual(exampleValueCoding);
  });

  test('Should generate valueCoding when type parameter is not used', () => {
    const exampleCode = { system: 'exampleSystem', code: 'exampleCode', display: 'Example Display' };
    const exampleValueCoding = {
      valueCoding: {
        system: 'exampleSystem',
        code: 'exampleCode',
        display: 'Example Display',
      },
    };
    expect(valueX(exampleCode)).toEqual(exampleValueCoding);
  });
});
