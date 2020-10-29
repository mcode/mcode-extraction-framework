const logger = require('../../helpers/logger');
const { getQuantityUnit } = require('../../helpers/fhirUtils');
const { coding } = require('./coding');

// Regex Patterns
const quantRegex = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?((\s){1,3}(\S{1,15}))?$/;
const dateRegex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$/;
const dateTimeRegex = /^\d\d\d\d-\d\d-\d\dT\d\d(:\d\d(:\d\d(-\d\d:\d\d)?)?)?$/;
const valueTimeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?$/;

// Array of supported value[x] types
const supportedTypes = [
  'valueBoolean',
  'valueCodeableConcept',
  'valueCoding',
  'valueDate',
  'valueDateTime',
  'valueDecimal',
  'valueInteger',
  'valuePeriod',
  'valueQuantity',
  'valueRange',
  'valueString',
];

function valueX(value, type = null) {
  let valueType = type;
  if (!supportedTypes.includes(valueType)) {
    switch (typeof value) {
      case 'number':
        valueType = 'valueInteger';
        break;

      case 'boolean':
        valueType = 'valueBoolean';
        break;

      case 'string':
        if (dateTimeRegex.test(value)) {
          valueType = 'valueDateTime';
        } else if (dateRegex.test(value)) {
          valueType = 'valueDate';
        } else if (valueTimeRegex.test(value)) {
          valueType = 'valueTime';
        } else if (quantRegex.test(value)) {
          valueType = 'valueQuantity';
        } else {
          valueType = 'valueString';
        }
        break;

      case 'object':
        if (value.high || value.low) {
          valueType = 'valueRange';
        } else if (value.start || value.end) {
          valueType = 'valuePeriod';
        } else if (value.value && value.code) {
          valueType = 'valueQuantity';
        } else if (value.system || value.version || value.code || value.display || value.userSelected) {
          valueType = 'valueCoding';
        } else {
          logger.debug(`The provided object has an unknown shape, including properties ${Object.keys(value)}`);
        }
        break;

      default:
        logger.warn(`Unable to determine the value[x] specialization with the provided value of type - ${typeof value}`);
        break;
    }
  }
  switch (valueType) {
    case 'valueCodeableConcept':
      return {
        valueCodeableConcept: {
          coding: [
            coding(value),
          ],
          ...(value.text && { text: value.text }),
        },
      };

    case 'valueInteger':
      return {
        valueInteger: parseInt(value, 10),
      };

    case 'valueDecimal':
      return {
        valueDecimal: parseFloat(value),
      };

    case 'valueBoolean':
      return {
        valueBoolean: value,
      };

    case 'valueDate':
      return {
        valueDate: value,
      };

    case 'valueDateTime':
      return {
        valueDateTime: value,
      };

    case 'valueTime':
      return {
        valueTime: value,
      };

    case 'valueQuantity':
      if (typeof value === 'string') {
        const quantMatch = quantRegex.exec(value);
        return {
          valueQuantity: {
            value: parseFloat(`${quantMatch[1]}${quantMatch[2] ? quantMatch[2] : ''}`, 10),
            ...(quantMatch[6] && {
              code: quantMatch[6],
              system: 'http://unitsofmeasure.org',
              unit: getQuantityUnit(quantMatch[6]),
            }),
          },
        };
      }
      return {
        valueQuantity: {
          unit: value.unit,
          code: value.code,
          value: value.value,
          system: 'http://unitsofmeasure.org',
        },
      };

    case 'valueString':
      return {
        valueString: value,
      };

    case 'valueRange':
      return {
        valueRange: {
          high: value.high,
          low: value.low,
        },
      };

    case 'valuePeriod':
      return {
        valuePeriod: {
          start: value.start,
          end: value.end,
        },
      };

    case 'valueCoding':
      return {
        valueCoding: coding(value),
      };
    default:
      logger.warn(`Unable to render a ${valueType} template with the provided data`);
      return null;
  }
}

module.exports = {
  valueX,
};
