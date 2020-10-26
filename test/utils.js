/* eslint-disable no-bitwise */

const Ajv = require('ajv');
const metaSchema = require('ajv/lib/refs/json-schema-draft-06.json');
const schema = require('./helpers/fixtures/fhir.schema.json');

const ajv = new Ajv({ logger: false });
ajv.addMetaSchema(metaSchema);
const validator = ajv.addSchema(schema, 'FHIR');

// Takes an object with optional arguments, a function, and an object with required arguments
// Ensures that all permutations of optionalArguments along with the requiredObj's args
// Never causes the testFn to fail
function allOptionalKeyCombinationsNotThrow(optionalObj, testFn, requiredObj = null) {
  const n = Object.keys(optionalObj).length;
  // There are 2^n many combinations of n-many keys, corresponding to a powerset;
  for (let i = 1; i < 2 ** n; i += 1) {
    // Use the current index to identify each member of our powerset
    // Use the `i` of our loop as a bitwise-and mask on the 10's column associated with each index (via bitshift)
    // E.g. Assume 4 keys, powerset of size 16; for all i < 16 (0-15); looking at where i=13
    // Keys we want include: [k0, k1, k3]
    // Mask:  1101 (i=13 in bitwise representation, right to left)
    // Keys:  [k0,   k1,   k2,   k3]
    // Inds:  [0,    1,    2,    3]
    // Ten's: [0001, 0010, 0100, 1000] (we get this with our 1 bit-shift)
    // Apply the mask with a bit-and to see which keys are included in this permutation
    // Incl?: [T,    T,    F,    T] -> Matches the expected kets to include
    const permutationKeys = Object.keys(optionalObj).filter((val, ind) => i & (1 << ind));
    const permutation = Object.keys(optionalObj)
      .filter((key) => permutationKeys.includes(key))
      .reduce((accum, key) => {
        // eslint-disable-next-line no-param-reassign
        accum[key] = optionalObj[key];
        return accum;
      }, {});
    expect(() => testFn({ ...requiredObj, ...permutation })).not.toThrow();
  }
}

function isValidFHIR(resource) {
  return validator.validate('FHIR', resource);
}

module.exports = {
  allOptionalKeyCombinationsNotThrow,
  isValidFHIR,
};
