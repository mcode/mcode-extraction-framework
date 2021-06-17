const fs = require('fs');
const { RunInstanceLogger } = require('../../src/application/tools/RunInstanceLogger.js');

describe('RunInstanceLogger', () => {
  describe('constructor', () => {
    const fsSpy = jest.spyOn(fs, 'readFileSync');
    it('should throw error when not provided a path', () => {
      expect(() => new RunInstanceLogger()).toThrowError();
    });

    it('should throw error when path does not point to valid JSON', () => {
      expect(() => new RunInstanceLogger('./bad-path')).toThrowError();
    });

    it('should throw error when log file is not an array', () => {
      fsSpy.mockReturnValueOnce(Buffer.from('{}'));
      expect(() => new RunInstanceLogger('path')).toThrowError('Log file needs to be an array.');
      expect(fsSpy).toHaveBeenCalled();
    });

    it('should not throw error when log file is an array', () => {
      expect(() => new RunInstanceLogger('./test/application/fixtures/run-logs.json')).not.toThrowError();
      expect(fsSpy).toHaveBeenCalled();
    });
  });

  describe('getEffectiveFromDate', () => {
    const testDate = '2020-06-16';

    it('should return fromDate when valid', () => {
      const runLogger = new RunInstanceLogger('./test/application/fixtures/run-logs.json');
      expect(runLogger.getEffectiveFromDate(testDate)).toEqual(testDate);
    });

    it('should return most recent date from runLogger', () => {
      const runLogger = new RunInstanceLogger('./test/application/fixtures/run-logs.json');
      expect(runLogger.getEffectiveFromDate(null)).toEqual(testDate);
    });

    it('should throw error when no recent date from runlogger', () => {
      const runLogger = new RunInstanceLogger('./test/application/fixtures/empty-run-logs.json');
      expect(() => runLogger.getEffectiveFromDate(null)).toThrowError();
    });
  });
});
