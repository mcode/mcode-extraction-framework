const _ = require('lodash');
const { ifSomeArgs } = require('../../helpers/templateUtils');

function extensionArr(...extensions) { // 0. Spread since 1..n extensions
  // Extensions should always return if at least one is provided; use ifSomeArgs
  return ifSomeArgs(
    (...extArr) => ({ extension: _.compact(extArr) }), // 2. Spread since 1...n extensions; _.compact to drop the falsy ones
  )(...extensions); // 1. Spread to pass each extension individually
}

module.exports = {
  extensionArr,
};
