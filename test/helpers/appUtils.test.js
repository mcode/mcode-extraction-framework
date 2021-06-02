const path = require('path');
const { parsePatientIds } = require('../../src/helpers/appUtils');

const MOCK_VALID_ID_CSV = path.join(__dirname, './fixtures/valid-mrns.csv');

// Has no MRN column
const MOCK_INVALID_ID_CSV = path.join(__dirname, './fixtures/invalid-mrns.csv');

describe('appUtils', () => {
  describe('parsePatientIds', () => {
    test('valid path should parse content', () => {
      const expectedIds = ['123', '456', '789'];
      const ids = parsePatientIds(MOCK_VALID_ID_CSV);

      // Should get every MRN
      expect(ids).toHaveLength(expectedIds.length);
      expect(ids).toEqual(expectedIds);
    });

    test('invalid path should throw error', () => {
      expect(() => parsePatientIds(MOCK_INVALID_ID_CSV)).toThrowError();
    });
  });
});
