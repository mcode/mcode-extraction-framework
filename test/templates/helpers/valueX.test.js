const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const VALUE_X_TEMPLATE = fs.readFileSync(path.join(__dirname, '../../../src/templates/helpers/valueX.ejs'), 'utf8');

function wrapAndParse(str) {
  console.log(str);
  return JSON.parse(`{${str}}`);
}

describe('test valueX template', () => {
  test('null data passed into template should generate empty string', () => {
    const generated = ejs.render(
      VALUE_X_TEMPLATE,
      null,
    );
    expect(generated).toEqual('');
  });

  test('supplying number value should result in valueInteger entry', () => {
    const generatedInteger = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: 34 },
    ));

    expect(generatedInteger).toEqual({ valueInteger: 34 });
  });

  test('supplying boolean value should result in valueBoolean entry', () => {
    const generatedFalse = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: false },
    ));

    const generatedTrue = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: true },
    ));

    expect(generatedFalse).toEqual({ valueBoolean: false });
    expect(generatedTrue).toEqual({ valueBoolean: true });
  });

  test('supplying string value should result in different entry types based n format of string', () => {
    const generatedQuantity = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '1979 m' },
    ));

    const generatedDateYearMonth = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '1979-01' },
    ));

    const generatedDateYearMonthDay = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '1979-01-01' },
    ));

    const generatedDateTime = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '1979-01-01T10:10' },
    ));

    const generatedTime = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '10:10:10' },
    ));

    const generatedString = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '10:10:10sdfasdfasdfasdfasdfasdf' },
    ));

    expect(generatedQuantity).toEqual({ valueQuantity: { value: 1979, unit: 'm' } });
    expect(generatedDateYearMonth).toEqual({ valueDate: '1979-01' });
    expect(generatedDateYearMonthDay).toEqual({ valueDate: '1979-01-01' });
    expect(generatedDateTime).toEqual({ valueDateTime: '1979-01-01T10:10' });
    expect(generatedTime).toEqual({ valueTime: '10:10:10' });
    expect(generatedString).toEqual({ valueString: '10:10:10sdfasdfasdfasdfasdfasdf' });
  });

  test('supplying coded value should result in valueCodableConcept entry', () => {
    const generatedCodableConcept = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: { code: 'Code1', system: 'system' } }, { filename: path.join(__dirname, '../../../src/templates/helpers/valueX.ejs') },
    ));

    expect(generatedCodableConcept).toEqual({ valueCodableConcept: { coding: [{ code: 'Code1', system: 'system' }] } });
  });

  test('supplying value and units  should result in valueQuantity entry', () => {
    const generatedQuantity = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: { value: 1979, unit: 'm' } },
    ));

    expect(generatedQuantity).toEqual({ valueQuantity: { value: 1979, unit: 'm' } });
  });

  test('supplying start and end  should result in valuePeriod entry', () => {
    const generatedPeriod = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: { start: '1979', end: '1980' } },
    ));

    expect(generatedPeriod).toEqual({ valuePeriod: { start: '1979', end: '1980' } });
  });

  test('supplying high and low  should result in valueRange entry', () => {
    const generatedRange = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: { low: '1979', high: '1980' } },
    ));

    expect(generatedRange).toEqual({ valueRange: { low: '1979', high: '1980' } });
  });
});
