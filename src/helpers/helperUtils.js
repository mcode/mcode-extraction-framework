// Helper function for inverting a object's keys and values s.t. (k->v) becomes (v->k)
function invertObject(obj) {
  return Object.entries(obj).reduce((ret, entry) => {
    const [key, value] = entry;
    // eslint-disable-next-line no-param-reassign
    ret[value] = key;
    return ret;
  }, {});
}

module.exports = {
  invertObject
}
