const { max } = require('lodash');
const { identifier, identifierArr } = require('../../../src/templates/snippets');
const { allOptionalKeyCombinationsNotThrow } = require('../../utils');
const maximalIdentifier = require('../fixtures/maximal-identifier.json');
const identifierArrayFixture = require('../fixtures/identifier-array.json');

describe('Identifier snippet', () => {
  test('Throws an error when no arguments are supplied', () => {
    expect(() => identifier()).toThrowError(TypeError);
  });
  test('Returns null when supplied empty objects or objs with null/undefined properties ', () => {
    expect(identifier({})).toBeNull();
    expect(identifier({ system: undefined })).toBeNull();
    expect(identifier({ system: null })).toBeNull();
    expect(identifier({ system: null, value: undefined })).toBeNull();
  });

  // Testing permutations of the maximal set of identifier arguments
  const MAXIMAL_IDENTIFIER = {
    system: 'http://system.com/codesystem',
    value: '90210',
    type: {
      text: 'Text explaining what this code system value is',
    },
  };
  test('Returns a maximal identifier object when all args are supplied', () => {
    expect(identifier(MAXIMAL_IDENTIFIER)).toEqual(maximalIdentifier);
  });
  test('Any combination of maximal identifier args will not throw an error', () => {
    allOptionalKeyCombinationsNotThrow(MAXIMAL_IDENTIFIER, identifier, {});
  });
});


describe('Array of Identifiers snippet', () => {
  test('Returns null when no arguments are supplied', () => {
    expect(identifierArr()).toBeNull();
  });
  test('Returns null when only undefined or null are supplied', () => {
    expect(identifierArr(undefined)).toBeNull();
    expect(identifierArr(null)).toBeNull();
    expect(identifierArr(null, undefined)).toBeNull();
  });

  // Testing 1...n identifier inputs
  const MAXIMAL_IDENTIFIER_1 = {
    system: 'http://system.com/codesystem',
    value: '90210',
    type: {
      text: 'Text explaining what this code system value is',
    },
  };
  const IDENTIFIER_2 = {
    system: 'http://system.com/testing',
    value: '02135',
  };
  test('Passing multiple identifiers returns an array with all of them in it', () => {
    expect(identifierArr(MAXIMAL_IDENTIFIER_1, IDENTIFIER_2)).toEqual(identifierArrayFixture);
  });
  test('Passing a single identifier object returns an array with one value in it', () => {
    expect(identifierArr(MAXIMAL_IDENTIFIER_1)).toEqual({ identifier: Array(identifierArrayFixture.identifier[0]) });
    expect(identifierArr(IDENTIFIER_2)).toEqual({ identifier: Array(identifierArrayFixture.identifier[1]) });
  });
});
