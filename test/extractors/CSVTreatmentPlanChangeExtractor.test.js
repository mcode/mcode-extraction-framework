const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVTreatmentPlanChangeExtractor } = require('../../src/extractors');
const exampleCSVTPCModuleResponse = require('./fixtures/csv-treatment-plan-change-module-response.json');
const exampleCSVTPCBundle = require('./fixtures/csv-treatment-plan-change-bundle.json');
const { getPatientFromContext } = require('../../src/helpers/contextUtils');
const MOCK_CONTEXT = require('./fixtures/context-with-patient.json');

// Constants for tests
const MOCK_PATIENT_MRN = 'mrn-1'; // linked to values in example-module-response above
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv');

// Instantiate module with parameters
const csvTPCExtractor = new CSVTreatmentPlanChangeExtractor({
  filePath: MOCK_CSV_PATH,
});

// Destructure all modules
const { csvModule } = csvTPCExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');
const formatData = rewire('../../src/extractors/CSVTreatmentPlanChangeExtractor.js').__get__('formatData');

describe('CSVTreatmentPlanChangeExtractor', () => {
  describe('formatData', () => {
    const exampleData = [
      {
        dateofcareplan: '2020-04-15',
        changed: 'false',
        mrn: 'id',
      },
      {
        dateofcareplan: '2020-04-30',
        changed: 'true',
        reasoncode: 'example code',
        mrn: 'id',
      },
    ];
    const patientId = getPatientFromContext(MOCK_CONTEXT).id;

    test('should join data appropriately and throw errors when missing required properties', () => {
      const expectedErrorString = 'Treatment Plan Change Data missing an expected property: dateOfCarePlan, changed are required';

      // formatData on example data should not throw error when changed is false
      expect(() => formatData(exampleData, patientId)).not.toThrowError();

      // Test required properties throw error
      const requiredKeys = ['dateofcareplan', 'changed'];
      requiredKeys.forEach((key) => {
        const clonedData = _.cloneDeep(exampleData);

        delete clonedData[0][key];
        expect(() => formatData(clonedData, patientId)).toThrow(new Error(expectedErrorString));
      });
    });

    test('should throw error if reasonCode is missing when changed flag is true.', () => {
      const expectedErrorString = 'reasonCode is required when changed flag is true';

      // error should get throw when changed flag is true and there is no reasonCode provided
      exampleData[0].changed = 'true';
      expect(() => formatData(exampleData, patientId)).toThrow(new Error(expectedErrorString));

      // No error should be throw when reasonCode is provided
      exampleData[0].reasoncode = 'example code';
      expect(() => formatData(exampleData, patientId)).not.toThrowError();
    });

    test('should join multiple entries into one', () => {
      const expectedFormattedData = [
        {
          subjectId: 'mrn-1',
          reviews: [
            {
              effectiveDate: '2020-04-15',
              hasChanged: 'true',
              reasonCode: '281647001',
              reasonDisplayText: 'Adverse reaction (disorder)',
            },
            {
              effectiveDate: '2020-04-30',
              reasonCode: '405613005',
              hasChanged: 'true',
            },
          ],
        },
      ];

      expect(formatData(exampleCSVTPCModuleResponse, patientId)).toEqual(expectedFormattedData);
    });
  });

  describe('get', () => {
    test('should return bundle with CarePlan', async () => {
      csvModuleSpy.mockReturnValue(exampleCSVTPCModuleResponse);
      const data = await csvTPCExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });

      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry.length).toEqual(1);
      expect(data).toEqual(exampleCSVTPCBundle);
    });

    test('should return empty bundle with no data available from module', async () => {
      csvModuleSpy.mockReturnValue([]);
      const data = await csvTPCExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });

      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry.length).toEqual(0);
    });
  });
});
