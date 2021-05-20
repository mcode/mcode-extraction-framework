const path = require('path');
const rewire = require('rewire');
const { CSVModule } = require('../../src/modules');
const exampleResponse = require('./fixtures/csv-response.json');

const CSVModuleRewired = rewire('../../src/modules/CSVModule.js');
const normalizeEmptyValues = CSVModuleRewired.__get__('normalizeEmptyValues');

const INVALID_MRN = 'INVALID MRN';
const csvModule = new CSVModule(path.join(__dirname, './fixtures/example-csv.csv'));
const csvModuleWithBOMs = new CSVModule(path.join(__dirname, './fixtures/example-csv-bom.csv'));


describe('CSVModule', () => {
  describe('get', () => {
    test('Reads data from CSV', async () => {
      const data = await csvModule.get('mrn', 'example-mrn-1');
      expect(data).toEqual(exampleResponse);
    });

    test('Reads data from CSV with a Byte Order Mark', async () => {
      const data = await csvModuleWithBOMs.get('mrn', 'example-mrn-1');
      expect(data).toEqual(exampleResponse);
    });

    test('Returns multiple rows', async () => {
      const data = await csvModule.get('mrn', 'example-mrn-2');
      expect(data).toHaveLength(2);
    });

    test('Returns all rows when both key and value are undefined', async () => {
      const data = await csvModule.get();
      expect(data).toHaveLength(csvModule.data.length);
      expect(data).toEqual(csvModule.data);
    });

    test('Returns data with recordedDate after specified from date', async () => {
      const data = await csvModule.get('mrn', 'example-mrn-2', '2020-05-01');
      expect(data).toHaveLength(1);
    });

    test('Returns data with recordedDate before specified to date', async () => {
      const data = await csvModule.get('mrn', 'example-mrn-2', null, '2020-05-01');
      expect(data).toHaveLength(1);
    });

    test('Should return an empty array when key-value pair does not exist', async () => {
      const data = await csvModule.get('mrn', INVALID_MRN);
      expect(data).toEqual([]);
    });

    test('Should return proper value regardless of key casing', async () => {
      const data = await csvModule.get('mRN', 'example-mrn-1');
      expect(data).toEqual(exampleResponse);
    });
  });

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
