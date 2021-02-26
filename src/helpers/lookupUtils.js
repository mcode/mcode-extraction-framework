/**
 * Create a lookup table that swaps keys and values s.t. (k->v) becomes (v->k)
 * @param {Object} lookup - a lookup table, defined by key-value pairs
 * @return {Object} the lookup table, with all keys and values inverted
 */
function createInvertedLookup(lookup) {
  return Object.entries(lookup).reduce((ret, entry) => {
    const [key, value] = entry;
    // eslint-disable-next-line no-param-reassign
    ret[value] = key;
    return ret;
  }, {});
}

/**
 * Create a lookup table where all the keys are lowercased
 * @param {Object} lookup - a lookup table, defined by key-value pairs
 * @return {Object} the lookup table, with all keys lowercased
 */
function createLowercaseLookup(lookup) {
  return Object.entries(lookup).reduce((ret, entry) => {
    const [k, v] = entry;
    // eslint-disable-next-line no-param-reassign
    ret[k.toLowerCase()] = v;
    return ret;
  }, {});
}

/**
 * Performs a lookup using the original key and a lowercase key
 * @param {String} key - key being queried for in the lookup
 * @param {Object} lookup - lookup table
 * @return {any} the value associated with that key
*/
function lowercaseLookupQuery(key, lookup) {
  const lowerKey = key.toLowerCase();
  return lookup[key] || lookup[lowerKey];
}

module.exports = {
  lowercaseLookupQuery,
  createLowercaseLookup,
  createInvertedLookup,
};
