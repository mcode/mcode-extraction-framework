const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVTreatmentPlanChangeExtractor } = require('../../src/extractors');
const exampleCSVTPCModuleResponse = require('./fixtures/csv-treatment-plan-change-module-response.json');
const exampleCSVTPCBundle = require('./fixtures/csv-treatment-plan-change-bundle.json');

const MOCK_MRN = 'mrn-1';
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv');
const csvTPCExtractor = new CSVTreatmentPlanChangeExtractor({
  filePath: MOCK_CSV_PATH,
});

const { csvModule } = csvTPCExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');

const formatData = rewire('../../src/extractors/CSVTreatmentPlanChangeExtractor.js').__get__('formatData');

describe('CSVTreatmentPlanChangeExtractor', () => {
  describe('formatData', () => {
    const exampleData = [
      {
        dateOfCarePlan: '2020-04-15',
        changed: 'false',
        mrn: 'id',
      },
    ];

    test('should join data appropriately and throw errors when missing required properties', () => {
      const expectedErrorString = 'Treatment Plan Change Data missing an expected property: mrn, dateOfCarePlan, changed are required';

      // formatData on example data should not throw error when changed is false
      expect(() => formatData(exampleData)).not.toThrowError();

      // Test required properties throw error
      Object.keys(exampleData[0]).forEach((key) => {
        const clonedData = _.cloneDeep(exampleData);

        delete clonedData[0][key];
        expect(() => formatData(clonedData)).toThrow(new Error(expectedErrorString));
      });
    });

    test('should throw error if reasonCode is missing when changed flag is true.', () => {
      const expectedErrorString = 'reasonCode is required when changed flag is true';

      // error should get throw when changed flag is true and there is no reasonCode provided
      exampleData[0].changed = 'true';
      expect(() => formatData(exampleData)).toThrow(new Error(expectedErrorString));

      // No error should be throw when reasonCode is provided
      exampleData[0].reasonCode = 'example code';
      expect(() => formatData(exampleData)).not.toThrowError();
    });
  });

  describe('get', () => {
    test('should return bundle with CarePlan', async () => {
      csvModuleSpy.mockReturnValue(exampleCSVTPCModuleResponse);
      const data = await csvTPCExtractor.get({ mrn: MOCK_MRN });

      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry.length).toEqual(1);
      expect(data).toEqual(exampleCSVTPCBundle);
    });

    test('should return empty bundle with no data available from module', async () => {
      csvModuleSpy.mockReturnValue([]);
      const data = await csvTPCExtractor.get({ mrn: MOCK_MRN });

      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry.length).toEqual(0);
    });
  });
});
