const logger = require('../../helpers/logger');
const { getQuantityUnit } = require('../../helpers/fhirUtils');
const { coding } = require('./coding');

// Regex Patterns
const quantRegex = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?((\s){1,3}(\S{1,15}))?$/;
const dateRegex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$/;
const dateTimeRegex = /^\d\d\d\d-\d\d-\d\dT\d\d(:\d\d(:\d\d(-\d\d:\d\d)?)?)?$/;
const valueTimeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?$/;

function valueByType(value, type) {
  switch (type) {
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
      logger.warn(`The type ${type} is not recognized by the ValueTemplate, attempting to infer the type of the value.`);
      return null;
  }
}

function valueX(value, type = null) {
  if (type) {
    const returnValue = valueByType(value, type);
    if (returnValue != null) {
      return returnValue;
    }
  }
  switch (typeof value) {
    case 'number':
      return {
        valueInteger: value,
      };

    case 'boolean':
      return {
        valueBoolean: value,
      };

    case 'string':
      if (dateRegex.test(value)) {
        return {
          valueDate: value,
        };
      }
      if (dateTimeRegex.test(value)) {
        return {
          valueDateTime: value,
        };
      }
      if (valueTimeRegex.test(value)) {
        return {
          valueTime: value,
        };
      }
      if (quantRegex.test(value)) {
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
        valueString: value,
      };

    case 'object':
      if (value.high || value.low) {
        return {
          valueRange: {
            high: value.high,
            low: value.low,
          },
        };
      } if (value.start || value.end) {
        return {
          valuePeriod: {
            start: value.start,
            end: value.end,
          },
        };
      } if (value.unit) {
        return {
          valueQuantity: {
            unit: value.unit,
            value: value.value,
          },
        };
      } if (value.system || value.version || value.code || value.display || value.userSelected) {
        return {
          valueCoding: coding(value),
        };
      }
      logger.warn(`Trying to render a ValueTemplate with an object of unknown shape, including properties ${Object.keys(value)}`);
      return null;

    default:
      logger.warn(`Trying to render a ValueTemplate with a value of unknown type - ${typeof value}`);
      return null;
  }
}

module.exports = {
  valueX,
};
