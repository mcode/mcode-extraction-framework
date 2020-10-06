const minimalReference = require('../fixtures/minimal-reference-object.json');
const maximalReference = require('../fixtures/maximal-reference-object.json');
const { reference } = require('../../../src/templates/snippets');
const { allOptionalKeyCombinationsNotThrow } = require('../../utils');

describe('Reference Snippet', () => {
  test('Throws an error when no argument is supplied', () => {
    expect(() => reference()).toThrowError(TypeError);
  });

  test('Throws an error when empty object is supplied', () => {
    expect(() => reference({})).toThrowError(Error);
  });

  test('Returns minimal reference object when minimal arguments are supplied.', () => {
    const MINIMAL_DATA = {
      id: 'example-id',
    };

    expect(reference(MINIMAL_DATA)).toEqual(minimalReference);
  });

  test('Returns minimal reference object when minimal arguments are supplied.', () => {
    const MAXIMAL_DATA = {
      id: 'example-id',
      name: 'example-name',
    };

    expect(reference(MAXIMAL_DATA)).toEqual(maximalReference);
  });

  test('missing non-required data should not throw an error', () => {
    const NECESSARY_DATA = {
      id: 'example-id',
    };

    const OPTIONAL_DATA = {
      name: 'example-name',
    };

    allOptionalKeyCombinationsNotThrow(OPTIONAL_DATA, reference, NECESSARY_DATA);
  });
});
