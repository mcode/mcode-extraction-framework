const _ = require('lodash');
const { ifSomeArgs } = require('../../helpers/templateUtils');

function extensionArr(...extensions) { // 0. Spread since 1..n extensions
  // Extensions should always return if at least one is provided; use ifSomeArgs
  return ifSomeArgs(
    (...extArr) => ({ extension: _.compact(extArr) }), // 2. Spread since 1...n extensions; _.compact to drop the falsy ones
  )(...extensions); // 1. Spread to pass each extension individually
}

// See http://hl7.org/fhir/R4/extension-data-absent-reason.html
// reasonCode is any code from Value Set http://hl7.org/fhir/R4/valueset-data-absent-reason.html
function dataAbsentReasonExtension(reasonCode) {
  return {
    url: 'http://hl7.org/fhir/StructureDefinition/data-absent-reason',
    valueCode: reasonCode,
  };
}

module.exports = {
  dataAbsentReasonExtension,
  extensionArr,
};
