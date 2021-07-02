const { normalizeEmptyValues, stringNormalizer } = require('../../src/helpers/csvParsingUtils.js');

describe('csvParsingUtils', () => {
  describe('normalizeEmptyValues', () => {
    it('Should turn "null" values into empty strings, regardless of case', () => {
      const data = [{ key: 'null' }, { key: 'NULL' }, { key: 'nuLL' }];
      const normalizedData = normalizeEmptyValues(data);
      normalizedData.forEach((d) => {
        expect(d.key).toBe('');
      });
    });

    it('Should turn "nil" values into empty strings, regardless of case', () => {
      const data = [{ key: 'nil' }, { key: 'NIL' }, { key: 'NIl' }];
      const normalizedData = normalizeEmptyValues(data);
      normalizedData.forEach((d) => {
        expect(d.key).toBe('');
      });
    });

    it('Should not modify unalterableColumns, regardless of their value', () => {
      const data = [{ key: 'null' }, { key: 'NULL' }, { key: 'nuLL' }, { key: 'nil' }, { key: 'NIL' }, { key: 'NIl' }];
      const normalizedData = normalizeEmptyValues(data, ['key']);
      normalizedData.forEach((d) => {
        expect(d.key).not.toBe('');
      });
    });

    it('Should leave all other values uneffected, regardless of case', () => {
      const data = [{ key: 'anything' }, { key: 'any' }, { key: 'thing' }];
      const normalizedData = normalizeEmptyValues(data);
      normalizedData.forEach((d) => {
        expect(d.key).not.toBe('');
      });
    });
  });
});
