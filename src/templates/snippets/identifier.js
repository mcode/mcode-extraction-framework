const { ifSomeArgs, ifSomeArgsObj } = require('../../helpers/templateUtils');

function identifier({ system, type, value }) {
  return ifSomeArgsObj(
    ({ system: system_, type: type_, value: value_ }) => ({
      identifier: {
        ...(system_ && { system: system_ }),
        ...(value_ && { value: value_ }),
        ...(type_ && { type: type_ }),
      },
    }),
  )({ system, type, value });
}

// Transform a list of identifier-objects into a list of identifier vales. Shape of return value below
// identifier: [
//  { system: "http://sys.com", value:"12345"},
//  { system: "http://sys.com", value:"54321"},
// ]
function identifierArr(...identifiers) {
  return ifSomeArgs(
    (...idenArr) => ({ identifier: idenArr.map((idenData) => identifier(idenData).identifier) }),
  )(...identifiers); // 1. Spread to pass each extension individually
}

module.exports = {
  identifier,
  identifierArr,
};
