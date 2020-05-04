const { NotImplementedError } = require('../../src/helpers/errors');
const { Extractor } = require('../../src/extractors');

const extractor = new Extractor();

describe('base extractor', () => {
  test('get should throw NotImplementedError', () => {
    expect(() => extractor.get()).toThrow(NotImplementedError);
  });
  test('updateRequestHeaders should throw NotImplementedError', () => {
    expect(() => extractor.updateRequestHeaders()).toThrow(NotImplementedError);
  });
});
