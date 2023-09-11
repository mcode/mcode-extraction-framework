const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVEncounterExtractor } = require('../../src/extractors');
const exampleCSVEncounterModuleResponse = require('./fixtures/csv-encounter-module-response.json');
const exampleCSVEncounterBundle = require('./fixtures/csv-encounter-bundle.json');
const { getPatientFromContext } = require('../../src/helpers/contextUtils');
const MOCK_CONTEXT = require('./fixtures/context-with-patient.json');

// Constants for tests
const MOCK_PATIENT_MRN = 'mrn-1'; // linked to values in example-module-response and context-with-patient above
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error
const IMPLEMENTATION = 'mcode';

// Rewired extractor for helper tests
const CSVEncounterExtractorRewired = rewire('../../src/extractors/CSVEncounterExtractor.js');

const formatData = CSVEncounterExtractorRewired.__get__('formatData');

// Instantiate module with parameters
const csvEncounterExtractor = new CSVEncounterExtractor({
  filePath: MOCK_CSV_PATH,
  implementation: IMPLEMENTATION,
});

// Destructure all modules
const { csvModule } = csvEncounterExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');


describe('CSVEncounterExtractor', () => {
  describe('formatData', () => {
    test('should format data appropriately and throw errors when missing required properties', () => {
      const expectedErrorString = 'Missing required field for Encounter CSV Extraction: encounterId, status, classCode or classSystem';
      const localData = _.cloneDeep(exampleCSVEncounterModuleResponse);
      const patientId = getPatientFromContext(MOCK_CONTEXT).id;

      // Test that valid data works fine
      expect(formatData(exampleCSVEncounterModuleResponse, patientId)).toEqual(expect.anything());

      localData[0].typecode = '';
      localData[0].enddate = '';

      // Only including required properties is valid
      expect(formatData(localData, patientId)).toEqual(expect.anything());

      const requiredProperties = ['encounterid', 'status', 'classcode', 'classsystem'];

      // Removing each required property should throw an error
      requiredProperties.forEach((key) => {
        const clonedData = _.cloneDeep(localData);
        clonedData[0][key] = '';
        expect(() => formatData(clonedData, patientId)).toThrow(new Error(expectedErrorString));
      });
    });
  });

  describe('get', () => {
    test('should return bundle with Observation', async () => {
      csvModuleSpy.mockReturnValue(exampleCSVEncounterModuleResponse);
      const data = await csvEncounterExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(1);
      expect(data.entry).toEqual(exampleCSVEncounterBundle.entry);
    });

    test('should return empty bundle when no data available from module', async () => {
      csvModuleSpy.mockReturnValue([]);
      const data = await csvEncounterExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(0);
    });
  });
});
