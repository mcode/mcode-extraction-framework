const { validateConfig, getConfig } = require('../../src/helpers/configUtils.js');
const testConfig = require('./fixtures/test-config.json');

describe('getConfig', () => {
  const pathToConfig = 'test/helpers/fixtures/test-config.json';

  it('should throw error when pathToConfig does not point to valid JSON file.', () => {
    expect(() => getConfig()).toThrowError();
  });

  it('should return test config', () => {
    const config = getConfig(pathToConfig);
    expect(config).toEqual(testConfig);
  });
});

describe('validateConfig', () => {
  const missingPropertyConfig = { patientIdCsvPath: '' };
  const wrongTypeConfig = { patientIdCsvPath: '', extractors: 12 };
  const wrongFormatConfig = { patientIdCsvPath: '', extractors: [], commonExtractorArgs: { baseFhirUrl: 'wrong' } };
  const validConfig = { patientIdCsvPath: '', extractors: [] };

  test('Should throw error when config file is missing required property', () => {
    expect(() => validateConfig(missingPropertyConfig)).toThrowError('Error(s) found in config file: config should have required property \'extractors\'');
  });

  test('Should throw error when property is of incorrect type', () => {
    expect(() => validateConfig(wrongTypeConfig)).toThrowError('Error(s) found in config file: config.extractors should be array');
  });

  test('Should throw error when property has incorrect format', () => {
    expect(() => validateConfig(wrongFormatConfig)).toThrowError('Error(s) found in config file: config.commonExtractorArgs.baseFhirUrl should match format "uri"');
  });

  test('Should not throw error when config file is valid', () => {
    expect(() => validateConfig(validConfig)).not.toThrow();
  });
});
