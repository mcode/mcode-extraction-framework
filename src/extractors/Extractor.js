/* eslint-disable class-methods-use-this */
const { NotImplementedError } = require('../helpers/errors');

class Extractor {
  updateRequestHeaders() {
    throw new NotImplementedError('Extractor must implement the "updateRequestHeaders" function if WebService-enabled modules are used');
  }

  get() {
    throw new NotImplementedError('Extractor must implement the "get" function');
  }
}

module.exports = {
  Extractor,
};
