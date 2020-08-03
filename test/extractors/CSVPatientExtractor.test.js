const path = require('path');
const { CSVPatientExtractor } = require('../../src/extractors');
const examplePatientResponse = require('./fixtures/csv-patient-module-response.json');
const examplePatientBundle = require('./fixtures/csv-patient-bundle.json');

// Constants for mock tests
const MOCK_PATIENT_MRN = 'EXAMPLE-MRN';
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error

// Instantiate module with mock parameters
const csvPatientExtractor = new CSVPatientExtractor({
  filePath: MOCK_CSV_PATH,
});

// Destructure all modules
const { csvModule } = csvPatientExtractor;
// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');


describe('CSV Patient Extractor', () => {
  describe('get', () => {
    test('should return a fhir bundle when MRN is known', async () => {
      csvModuleSpy.mockReset();
      csvModuleSpy
        .mockReturnValue(examplePatientResponse);
      const data = await csvPatientExtractor.get({ mrn: MOCK_PATIENT_MRN });

      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(1);
      expect(data.entry).toEqual(examplePatientBundle.entry);
    });
  });
});
