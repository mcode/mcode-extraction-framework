/* eslint-disable no-bitwise */
function allKeyCombinationsNotThrow(maximalObject, testFn) {
  const n = Object.keys(maximalObject).length;
  // There are 2^n many combinations of n-many keys, corresponding to a powerset;
  for (let i = 1; i < 2 ** n; i += 1) {
    // Use the current index to identify each member of our powerset
    // Use the `i` of our loop as a bitwise-and mask on the 10's column associated with each index (via bitshift)
    // E.g. Assume 4 keys, powerset of size 16; for all i < 16 (0-15); looking at where i=13
    // Keys we want include: [k0, k2, k3]
    // Mask:  1011 (i/13 in bitwise representation, right to left)
    // Keys:  [k0,   k1,   k2,   k3]
    // Inds:  [0,    1,    2,    3]
    // Ten's: [0001, 0010, 0100, 1000] (we get this with our 1 bit-shift)
    // Incl?: [T,    F,    T,    T]
    const subsetKeys = Object.keys(maximalObject).filter((val, ind) => i & (1 << ind));
    const subset = Object.keys(maximalObject)
      .filter((key) => subsetKeys.includes(key))
      .reduce((accum, key) => {
        // eslint-disable-next-line no-param-reassign
        accum[key] = maximalObject[key];
        return accum;
      }, {});
    expect(() => testFn(subset)).not.toThrow();
  }
}

module.exports = {
  allKeyCombinationsNotThrow,
};
