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
      { value: null },
    );
    expect(generated).toEqual('');
  });

  test('supplying number value should result in valueInteger entry', () => {
    const generatedInteger = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: 34, excludePreComma: true },
    ));

    expect(generatedInteger).toEqual({ valueInteger: 34 });
  });

  test('supplying boolean value should result in valueBoolean entry', () => {
    const generatedFalse = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: false, excludePreComma: true },
    ));

    const generatedTrue = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: true, excludePreComma: true },
    ));

    expect(generatedFalse).toEqual({ valueBoolean: false });
    expect(generatedTrue).toEqual({ valueBoolean: true });
  });

  test('supplying string value should result in different entry types based n format of string', () => {
    const generatedQuantity = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '1979 m', excludePreComma: true },
    ));

    const generatedDateYearMonth = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '1979-01', excludePreComma: true },
    ));

    const generatedDateYearMonthDay = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '1979-01-01', excludePreComma: true },
    ));

    const generatedDateTime = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '1979-01-01T10:10', excludePreComma: true },
    ));

    const generatedTime = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '10:10:10', excludePreComma: true },
    ));

    const generatedString = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: '10:10:10sdfasdfasdfasdfasdfasdf', excludePreComma: true },
    ));

    expect(generatedQuantity).toEqual({ valueQuantity: { value: 1979, unit: 'm' } });
    expect(generatedDateYearMonth).toEqual({ valueDate: '1979-01' });
    expect(generatedDateYearMonthDay).toEqual({ valueDate: '1979-01-01' });
    expect(generatedDateTime).toEqual({ valueDateTime: '1979-01-01T10:10' });
    expect(generatedTime).toEqual({ valueTime: '10:10:10' });
    expect(generatedString).toEqual({ valueString: '10:10:10sdfasdfasdfasdfasdfasdf' });
  });

  test('supplying coded value should result in valueCodeableConcept entry', () => {
    const generatedCodeableConcept = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: { code: 'Code1', system: 'system' }, excludePreComma: true }, { root: path.join(__dirname, '../../../src/templates/') },
    ));

    expect(generatedCodeableConcept).toEqual({ valueCodeableConcept: { coding: [{ code: 'Code1', system: 'system' }] } });
  });

  test('supplying value and units  should result in valueQuantity entry', () => {
    const generatedQuantity = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: { value: 1979, unit: 'm' }, excludePreComma: true },
    ));

    expect(generatedQuantity).toEqual({ valueQuantity: { value: 1979, unit: 'm' } });
  });

  test('supplying start and end  should result in valuePeriod entry', () => {
    const generatedPeriod = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: { start: '1979', end: '1980' }, excludePreComma: true },
    ));

    expect(generatedPeriod).toEqual({ valuePeriod: { start: '1979', end: '1980' } });
  });

  test('supplying high and low  should result in valueRange entry', () => {
    const generatedRange = wrapAndParse(ejs.render(
      VALUE_X_TEMPLATE,
      { value: { low: '1979', high: '1980' }, excludePreComma: true },
    ));

    expect(generatedRange).toEqual({ valueRange: { low: '1979', high: '1980' } });
  });
});
