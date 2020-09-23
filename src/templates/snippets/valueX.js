const logger = require('../../helpers/logger');

// Regex Patterns
const quantRegex = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?((\s){1,3}(\S{1,15}))?$/;
const dateRegex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$/;
const dateTimeRegex = /^\d\d\d\d-\d\d-\d\dT\d\d(:\d\d(:\d\d(-\d\d:\d\d)?)?)?$/;
const valueTimeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?$/;

function valueX(value) {
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
        const quantMatch = quantRegex.test(value);
        return {
          valueQuantity: {
            value: quantMatch[1],
            ...(quantMatch[6] && { unit: quantMatch[6] }),
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
