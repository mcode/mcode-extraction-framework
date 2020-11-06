const fs = require('fs');
const rewire = require('rewire');
const testConfig = require('./fixtures/test-config.json');
// const { MCODEClient } = require('../../src/client/MCODEClient');
// const { mcodeApp } = require('../../src/cli/app');

const app = rewire('../../src/cli/app.js');
const getConfig = app.__get__('getConfig');
const checkInputAndConfig = app.__get__('checkInputAndConfig');
const checkLogFile = app.__get__('checkLogFile');
const getEffectiveFromDate = app.__get__('getEffectiveFromDate');
// let extractDataForPatients = app.__get__('extractDataForPatients');

describe('App Tests', () => {
  describe('getConfig', () => {
    const pathToConfig = 'test/cli/fixtures/test-config.json';

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

  describe('checkLogFile', () => {
    const fsSpy = jest.spyOn(fs, 'readFileSync');
    it('should throw error when not provided a path', () => {
      expect(() => checkLogFile()).toThrowError();
    });

    it('should throw error when path does not point to valid JSON', () => {
      expect(() => checkLogFile('./bad-path')).toThrowError();
    });

    it('should throw error when log file is not an array', () => {
      fsSpy.mockReturnValueOnce(Buffer.from('{}'));
      expect(() => checkLogFile('path')).toThrowError('Log file needs to be an array.');
      expect(fsSpy).toHaveBeenCalled();
    });

    it('should not throw error when log file is an array', () => {
      fsSpy.mockReturnValueOnce(Buffer.from('[]'));
      expect(() => checkLogFile('path')).not.toThrowError();
      expect(fsSpy).toHaveBeenCalled();
    });
  });

  describe('getEffectiveFromDate', () => {
    const testDate = '2020-06-16';
    const mockRunLogger = {
      getMostRecentToDate: jest.fn(),
    };

    it('should return fromDate when valid', () => {
      expect(getEffectiveFromDate(testDate)).toEqual(testDate);
    });

    it('should return most recent date from runLogger', () => {
      mockRunLogger.getMostRecentToDate.mockReset();
      mockRunLogger.getMostRecentToDate.mockReturnValue(testDate);
      expect(getEffectiveFromDate(null, mockRunLogger)).toEqual(testDate);
    });

    it('should throw error when no recent date from runlogger', () => {
      mockRunLogger.getMostRecentToDate.mockReset();
      expect(() => getEffectiveFromDate(null, mockRunLogger)).toThrowError();
      expect(mockRunLogger.getMostRecentToDate).toHaveBeenCalled();
    });
  });

  describe('mcodeApp', () => {
    it('should call extractDataForPatients with correct patient ids, dates, and client', () => {
      // // mcodeApp.extractDataForPatients = jest.fn();
      // extractDataForPatients = jest.fn();
      // expect(() => mcodeApp(MCODEClient, '2020-01-01', '2020-10-10', 'test/cli/fixtures/test-config.json', 'test/cli/fixtures/test-bundle.json', false, false)).not.toThrowError();
      // expect(extractDataForPatients).toHaveBeenCalled();
    });

    it('should call sendEmailNotification if notificationInfo present in config', () => {});
    it('should add successful runs to log', () => {});
    it('should not add unsuccessful runs to log', () => {});
    it('should not add successful runs to log if extracting all entries', () => {});
    it('should write data to file when successful', () => {});

    it('should throw error when error in log file', () => {});
    it('should throw error when config file invalid', () => {});
    it('should throw error when error in input or config file', () => {});
    it('should throw error when no effective date can be found', () => {});
  });
});
