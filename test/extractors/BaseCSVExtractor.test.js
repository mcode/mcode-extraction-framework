const { BaseCSVExtractor } = require('../../src/extractors');

// Tests
describe('BaseCSVExtractor', () => {
  describe('constructor', () => {
    test('Should create a CSVURLModule when provided a filePath', () => {
      const filePathExtractor = new BaseCSVExtractor({ filePath: '/Users/dphelan/Development/mcode-extraction-framework/test/extractors/fixtures/example.csv' });
      expect(filePathExtractor.csvModule).not.toBeUndefined();
      expect(filePathExtractor.csvModule.constructor.name).toEqual('CSVFileModule');
    });
    test('Should create a CSVFileModule when provided a URL', () => {
      const urlExtractor = new BaseCSVExtractor({ url: 'http://example.com' });
      expect(urlExtractor.csvModule).not.toBeUndefined();
      expect(urlExtractor.csvModule.constructor.name).toEqual('CSVURLModule');
    });
    test('Should create a CSVFileModule when provided a fileName and a dataDirectory', () => {
      const fileNameDataDirectoryExtractor = new BaseCSVExtractor({ fileName: 'example.csv', dataDirectory: '/Users/dphelan/Development/mcode-extraction-framework/test/extractors/fixtures/' });
      expect(fileNameDataDirectoryExtractor.csvModule).not.toBeUndefined();
      expect(fileNameDataDirectoryExtractor.csvModule.constructor.name).toEqual('CSVFileModule');
    });
    test('Should fail when provided only provided a fileName and no dataDirectory', () => {
      expect(() => new BaseCSVExtractor({ fileName: 'example.csv' })
        .toThrowError('Trying to instantiate a CSVExtractor without a valid filePath, url, or fileName+dataDirectory combination'));
    });
    test('Should fail when provided only provided a dataDirectory and no fileName', () => {
      expect(() => new BaseCSVExtractor({ dataDirectory: '/Users/dphelan/Development/mcode-extraction-framework/test/extractors/fixtures/' })
        .toThrowError('Trying to instantiate a CSVExtractor without a valid filePath, url, or fileName+dataDirectory combination'));
    });
    test('Should fail when provided none of the three options above', () => {
      expect(() => new BaseCSVExtractor({})
        .toThrowError('Trying to instantiate a CSVExtractor without a valid filePath, url, or fileName+dataDirectory combination'));
    });
  });
  // test('updateRequestHeaders calls its modules updateRequestHeaders function', () => {
  //   moduleRequestHeadersSpy.mockClear();
  //   baseFHIRExtractor.updateRequestHeaders(MOCK_REQUEST_HEADERS);
  //   expect(moduleRequestHeadersSpy).toHaveBeenCalledWith(MOCK_REQUEST_HEADERS);
  // });

  // test('parametrizeArgsForFHIRModule parses data off of context if available', async () => {
  //   baseFHIRModuleSearchSpy.mockClear();
  //   const paramsBasedOnContext = await baseFHIRExtractor.parametrizeArgsForFHIRModule({ context: MOCK_CONTEXT });
  //   expect(baseFHIRModuleSearchSpy).not.toHaveBeenCalled();
  //   expect(paramsBasedOnContext).toHaveProperty('patient');
  //   expect(paramsBasedOnContext.patient).toEqual(MOCK_CONTEXT.entry[0].resource.id);
  // });

  // test('parametrizeArgsForFHIRModule throws an error if context has no relevant ID', async () => {
  //   baseFHIRModuleSearchSpy.mockClear();
  //   await expect(baseFHIRExtractor.parametrizeArgsForFHIRModule({ context: {} })).rejects.toThrow();
  //   expect(baseFHIRModuleSearchSpy).not.toHaveBeenCalled();
  // });

  // test('get should return a condition resource', async () => {
  //   const data = await baseFHIRExtractor.get({ context: MOCK_CONTEXT });
  //   expect(data.resourceType).toEqual('Bundle');
  //   expect(data.entry).toBeDefined();
  //   expect(data.entry.length).toBeGreaterThan(0);
  //   expect(data.entry[0].resource.resourceType).toEqual('Condition');

  //   // expect data to contain every element in the example
  //   expect(data.entry).toEqual(expect.arrayContaining(exampleConditionBundle.entry));
  // });
});
