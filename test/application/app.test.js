const rewire = require('rewire');

const app = rewire('../../src/application/app.js');
const checkInputAndConfig = app.__get__('checkInputAndConfig');

describe('App Tests', () => {
  describe('checkInputAndConfig', () => {
    const config = { patientIdCsvPath: '', extractors: [] };
    it('should throw error when fromDate is invalid.', () => {
      expect(() => checkInputAndConfig(config, '2020-06-31')).toThrowError('-f/--from-date is not a valid date.');
    });
    it('should throw error when toDate is invalid date.', () => {
      expect(() => checkInputAndConfig(config, '2020-06-30', '2020-06-31')).toThrowError('-t/--to-date is not a valid date.');
    });
    it('should throw error when config is not valid', () => {
      expect(() => checkInputAndConfig({}))
        .toThrowError('Error(s) found in config file: config should have required property \'patientIdCsvPath\', config should have required property \'extractors\'');
    });
    it('should not throw error when all args are valid', () => {
      expect(() => checkInputAndConfig(config, '2020-06-01', '2020-06-30')).not.toThrowError();
    });
  });
});
