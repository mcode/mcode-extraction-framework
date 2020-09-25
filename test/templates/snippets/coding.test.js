const { coding } = require('../../../src/templates/snippets');
const { allKeyCombinationsNotThrow } = require('../../utils');
const maximalCoding = require('../fixtures/maximal-coding-object.json');

describe('Coding Snippet', () => {
  test('Throws an error when no argument is supplied', () => {
    // Throws a TypeError since it's expecting an object that it can destructure
    expect(() => coding()).toThrowError(TypeError);
  });

  test('Returns null when non-`object` arguments are supplied', () => {
    // Throws a TypeError since it's expecting an object that it can destructure
    expect(coding(1)).toBeNull();
    expect(coding([])).toBeNull();
    expect(coding(true)).toBeNull();
    expect(coding('code', 'system')).toBeNull();
  });

  test('Returns null when any empty object is supplied as an argument ', () => {
    expect(coding({})).toBeNull();
  });

  test('Returns a saturated coding object when all arguments are supplied', () => {
    const MAX_CODING_INPUT = {
      system: 'example-sys',
      version: 'v3.1.4',
      code: 'example-code',
      display: 'A string of display text',
      userSelected: true,
    };

    expect(coding(MAX_CODING_INPUT)).toEqual(maximalCoding);
  });

  test('Any combination of properties will not throw an error', () => {
    const MAX_CODING_INPUT = {
      system: 'example-sys',
      version: 'v3.1.4',
      code: 'example-code',
      display: 'A string of display text',
      userSelected: true,
    };

    allKeyCombinationsNotThrow(MAX_CODING_INPUT, coding);
  });
});
