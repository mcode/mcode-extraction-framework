const { ifSomeArgsObj } = require('../../helpers/templateUtils');

// Template for FHIR Coding, based on https://www.hl7.org/fhir/datatypes.html#Coding
function coding({
  system, version, code, display, userSelected,
}) {
  return ifSomeArgsObj(
    ({
      system: system_, version: version_, code: code_, display: display_, userSelected: userSelected_, // using the _ to avoid duplicating vars across scopes
    }) => ({
      ...(system_ && { system: system_ }),
      ...(version_ && { version: version_ }),
      ...(code_ && { code: code_ }),
      ...(display_ && { display: display_ }),
      ...(userSelected_ && { userSelected: userSelected_ }),
    }),
  )({ system, version, code, display, userSelected });
}

module.exports = {
  coding,
};
