const path = require('path');
const { parsePatientIds } = require('../../src/helpers/appUtils');

const MOCK_VALID_ID_CSV = path.join(__dirname, './fixtures/valid-mrns.csv');
const MOCK_VALID_ID_CSV_WITH_BOM = path.join(__dirname, './fixtures/valid-mrns-bom.csv');

// Has no MRN column
const MOCK_INVALID_ID_CSV = path.join(__dirname, './fixtures/invalid-mrns.csv');

describe('appUtils', () => {
  describe('parsePatientIds', () => {
    test('valid path should parse content', () => {
      const expectedIds = ['123', '456', '789'];
      const ids = parsePatientIds({ patientIdCsvPath: MOCK_VALID_ID_CSV });

      // Should get every MRN
      expect(ids).toHaveLength(expectedIds.length);
      expect(ids).toEqual(expectedIds);
    });

    test('valid path to CSV with BOM should parse content', () => {
      const expectedIds = ['123', '456', '789'];
      const ids = parsePatientIds({ patientIdCsvPath: MOCK_VALID_ID_CSV_WITH_BOM });

      // Should get every MRN and correctly parse with BOM
      expect(ids).toHaveLength(expectedIds.length);
      expect(ids).toEqual(expectedIds);
    });

    test('invalid path should throw error', () => {
      expect(() => parsePatientIds({ patientIdCsvPath: MOCK_INVALID_ID_CSV })).toThrowError();
    });
  });
});
