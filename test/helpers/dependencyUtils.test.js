const _ = require('lodash');
const { sortExtractors } = require('../../src/helpers/dependencyUtils.js');

const WRONG_ORDER = [
  { type: 'Extractor3' },
  { type: 'Extractor1' },
  { type: 'Extractor2' },
];

const MISSING = [
  { type: 'Extractor1' },
  { type: 'Extractor3' },
];

const NO_CHANGE = [
  { type: 'Extractor1' },
  { type: 'Extractor2' },
  { type: 'Extractor3' },
];

const DEPENDENCY_INFO = [
  { type: 'Extractor1', dependencies: [] },
  { type: 'Extractor2', dependencies: ['Extractor1'] },
  { type: 'Extractor3', dependencies: ['Extractor1', 'Extractor2'] },
];

describe('sortExtractors', () => {
  test('should put extractors in the correct order', () => {
    sortExtractors(WRONG_ORDER, DEPENDENCY_INFO);
    expect(WRONG_ORDER[0].type).toEqual('Extractor1');
    expect(WRONG_ORDER[1].type).toEqual('Extractor2');
    expect(WRONG_ORDER[2].type).toEqual('Extractor3');
  });

  test('should change nothing if all extractors are in order with all dependencies', () => {
    const unchanged = _.cloneDeep(NO_CHANGE);
    sortExtractors(unchanged, DEPENDENCY_INFO);
    expect(unchanged).toEqual(NO_CHANGE);
  });

  test('should fail when missing dependencies', () => {
    expect(() => sortExtractors(MISSING, DEPENDENCY_INFO)).toThrow();
  });
});
