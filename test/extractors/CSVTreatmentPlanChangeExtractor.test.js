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
    test('should join data appropriately and throw errors when missing required properties', () => {
      const expectedErrorString = 'Treatment Plan Change Data missing an expected property: mrn, dateOfCarePlan, reasonCode, changed are required';
      const exampleData = [
        {
          dateOfCarePlan: '04/15/2020',
          changed: true,
          reasonCode: 'exampleCode',
          mrn: 'id',
        },
      ];

      // Test required properties throw error
      Object.keys(exampleData[0]).forEach((key) => {
        const clonedData = _.cloneDeep(exampleData);

        delete clonedData[0][key];
        expect(() => formatData(clonedData)).toThrow(new Error(expectedErrorString));
      });
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
