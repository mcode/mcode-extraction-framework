const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVAppointmentExtractor } = require('../../src/extractors');
const exampleCSVAppointmentModuleResponse = require('./fixtures/csv-appointment-module-response.json');
const exampleCSVAppointmentBundle = require('./fixtures/csv-appointment-bundle.json');
const { getPatientFromContext } = require('../../src/helpers/contextUtils');
const MOCK_CONTEXT = require('./fixtures/context-with-patient.json');

// Constants for tests
const MOCK_PATIENT_MRN = 'mrn-1'; // linked to values in example-module-response and context-with-patient above
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error
const IMPLEMENTATION = 'mcode';

// Rewired extractor for helper tests
const CSVAppointmentExtractorRewired = rewire('../../src/extractors/CSVAppointmentExtractor.js');

const formatData = CSVAppointmentExtractorRewired.__get__('formatData');

// Instantiate module with parameters
const csvAppointmentExtractor = new CSVAppointmentExtractor({
  filePath: MOCK_CSV_PATH,
  implementation: IMPLEMENTATION,
});

// Destructure all modules
const { csvModule } = csvAppointmentExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');


describe('CSVAppointmentExtractor', () => {
  describe('formatData', () => {
    test('should format data appropriately and throw errors when missing required properties', () => {
      const expectedErrorString = 'Missing required field for Appointment CSV Extraction: appointmentId or status';
      const localData = _.cloneDeep(exampleCSVAppointmentModuleResponse);
      const patientId = getPatientFromContext(MOCK_CONTEXT).id;

      // Test that valid data works fine
      expect(formatData(exampleCSVAppointmentModuleResponse, patientId)).toEqual(expect.anything());

      localData[0].start = '';
      localData[0].cancelationcode = '';

      // Only including required properties is valid
      expect(formatData(localData, patientId)).toEqual(expect.anything());

      const requiredProperties = ['appointmentid', 'status'];

      // Removing each required property should throw an error
      requiredProperties.forEach((key) => {
        const clonedData = _.cloneDeep(localData);
        clonedData[0][key] = '';
        expect(() => formatData(clonedData, patientId)).toThrow(new Error(expectedErrorString));
      });
    });
  });

  describe('get', () => {
    test('should return bundle with Appointment', async () => {
      csvModuleSpy.mockReturnValue(exampleCSVAppointmentModuleResponse);
      const data = await csvAppointmentExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(1);
      expect(data.entry).toEqual(exampleCSVAppointmentBundle.entry);
    });

    test('should return empty bundle when no data available from module', async () => {
      csvModuleSpy.mockReturnValue([]);
      const data = await csvAppointmentExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });
      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(0);
    });
  });
});
