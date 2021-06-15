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
    const sorted = sortExtractors(WRONG_ORDER, DEPENDENCY_INFO);
    expect(sorted[0].type).toEqual('Extractor1');
    expect(sorted[1].type).toEqual('Extractor2');
    expect(sorted[2].type).toEqual('Extractor3');
  });

  test('should change nothing if all extractors are in order with all dependencies', () => {
    const unchanged = sortExtractors(NO_CHANGE, DEPENDENCY_INFO);
    expect(unchanged).toEqual(NO_CHANGE);
  });

  test('should fail when missing dependencies', () => {
    expect(() => sortExtractors(MISSING, DEPENDENCY_INFO)).toThrow();
  });
});
