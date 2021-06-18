const rewire = require('rewire');
const testConfig = require('./fixtures/test-config.json');

const app = rewire('../../src/application/app.js');
const getConfig = app.__get__('getConfig');
const checkInputAndConfig = app.__get__('checkInputAndConfig');

describe('App Tests', () => {
  describe('getConfig', () => {
    const pathToConfig = 'test/application/fixtures/test-config.json';

    it('should throw error when pathToConfig does not point to valid JSON file.', () => {
      expect(() => getConfig()).toThrowError();
    });

    it('should return test config', () => {
      const config = getConfig(pathToConfig);
      expect(config).toEqual(testConfig);
    });
  });

  describe('checkInputAndConfig', () => {
    it('should throw error when fromDate is invalid.', () => {
      expect(() => checkInputAndConfig(testConfig, '2020-06-31')).toThrowError('-f/--from-date is not a valid date.');
    });
    it('should throw error when toDate is invalid date.', () => {
      expect(() => checkInputAndConfig(testConfig, '2020-06-30', '2020-06-31')).toThrowError('-t/--to-date is not a valid date.');
    });
    it('should throw error when patientIdCsvPath not provided in config', () => {
      expect(() => checkInputAndConfig({})).toThrowError('patientIdCsvPath is required in config file');
    });
    it('should not throw error when all args are valid', () => {
      expect(() => checkInputAndConfig(testConfig, '2020-06-01', '2020-06-30')).not.toThrowError();
    });
  });
});
