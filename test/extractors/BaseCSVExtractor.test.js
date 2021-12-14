const path = require('path');
const { BaseCSVExtractor } = require('../../src/extractors');

// Some global variables
const fixturesPath = path.join(__dirname, 'fixtures');
const csvFileName = 'example.csv';

// Tests
describe('BaseCSVExtractor', () => {
  test('Should create a CSVURLModule when provided a filePath that is an absolute path', () => {
    const absolutePath = path.join(fixturesPath, csvFileName);
    const filePathExtractor = new BaseCSVExtractor({ filePath: absolutePath });
    expect(filePathExtractor.csvModule).not.toBeUndefined();
    expect(filePathExtractor.csvModule.constructor.name).toEqual('CSVFileModule');
  });
  test('Should create a CSVFileModule when provided a URL', () => {
    const urlExtractor = new BaseCSVExtractor({ url: 'http://example.com' });
    expect(urlExtractor.csvModule).not.toBeUndefined();
    expect(urlExtractor.csvModule.constructor.name).toEqual('CSVURLModule');
  });
  test('Should create a CSVFileModule when provided a fileName and a dataDirectory', () => {
    const fileNameDataDirectoryExtractor = new BaseCSVExtractor({ fileName: csvFileName, dataDirectory: fixturesPath });
    expect(fileNameDataDirectoryExtractor.csvModule).not.toBeUndefined();
    expect(fileNameDataDirectoryExtractor.csvModule.constructor.name).toEqual('CSVFileModule');
  });
  test('Should fail when the provided dataDirectory is not an absolute path', () => {
    expect(() => new BaseCSVExtractor({ fileName: csvFileName, dataDirectory: './fixtures/' }))
      .toThrowError('dataDirectory is not an absolutePath, it needs to be.');
  });
  test('Should fail when provided only provided a fileName and no dataDirectory', () => {
    expect(() => new BaseCSVExtractor({ fileName: csvFileName }))
      .toThrowError('Trying to instantiate a CSVExtractor without a valid filePath, url, or fileName+dataDirectory combination');
  });
  test('Should fail when provided only provided a dataDirectory and no fileName', () => {
    expect(() => new BaseCSVExtractor({ dataDirectory: fixturesPath }))
      .toThrowError('Trying to instantiate a CSVExtractor without a valid filePath, url, or fileName+dataDirectory combination');
  });
  test('Should fail when provided none of the three options above', () => {
    expect(() => new BaseCSVExtractor({}))
      .toThrowError('Trying to instantiate a CSVExtractor without a valid filePath, url, or fileName+dataDirectory combination');
  });
});
