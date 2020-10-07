const _ = require('lodash');

// A decorator that modifies a template to only render
// when all of its arguments' values are not null/undefined, returning null otherwise
// NOTE: Will not return null if the arguments are not defined; just checks if they're present with undefined/null values
function ifAllArgs(templateFn) {
  return (...args) => {
    if (_.some(args, (arg) => _.isUndefined(arg) || _.isNull(arg))) {
      return null;
    }
    return templateFn(...args);
  };
}

// A decorator that modifies a template to only render
// when all of the values on its argumentsObject are not null/empty, returning null otherwise
// NOTE: Will not return null if the argumentsObj/properties are not defined; just checks if they're present with undefined/null values
function ifAllArgsObj(templateFn) {
  return (argObj) => {
    if (_.some(Object.values(argObj), (arg) => _.isUndefined(arg) || _.isNull(arg))) {
      return null;
    }
    return templateFn(argObj);
  };
}

// A decorator that modifies a template to only render
// when some of its arguments are not null/undefined, returning null otherwise
// NOTE: Will not return null if the arguments are not defined; just checks if they're present with undefined/null values
function ifSomeArgs(templateFn) {
  return (...args) => {
    if (_.every(args, (arg) => _.isUndefined(arg) || _.isNull(arg))) {
      return null;
    }
    return templateFn(...args);
  };
}

// A decorator that modifies a template to only render
// when some of the values on its argumentsObject are not null/empty, returning null otherwise
// NOTE: Will not return null if the argumentsObj/properties are not defined; just checks if they're present with undefined/null values
function ifSomeArgsObj(templateFn) {
  return (argObj) => {
    if (_.every(Object.values(argObj), (arg) => _.isUndefined(arg) || _.isNull(arg))) {
      return null;
    }
    return templateFn(argObj);
  };
}

module.exports = {
  ifAllArgs,
  ifAllArgsObj,
  ifSomeArgs,
  ifSomeArgsObj,
};
