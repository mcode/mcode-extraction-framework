const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVCancerDiseaseStatusExtractor } = require('../../src/extractors');
const exampleCSVDiseaseStatusModuleResponse = require('./fixtures/csv-cancer-disease-status-module-response.json');
const exampleCSVDiseaseStatusBundle = require('./fixtures/csv-cancer-disease-status-bundle.json');

// Rewired extractor for helper tests
const CSVCancerDiseaseStatusExtractorRewired = rewire('../../src/extractors/CSVCancerDiseaseStatusExtractor.js');

// Constants for tests
const MOCK_PATIENT_MRN = 'pat-mrn-1'; // linked to values in example-module-response above
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error

// Instantiate module with parameters
const csvCancerDiseaseStatusExtractor = new CSVCancerDiseaseStatusExtractor({
  filePath: MOCK_CSV_PATH,
});

// Destructure all modules
const { csvModule } = csvCancerDiseaseStatusExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');

const joinAndReformatData = CSVCancerDiseaseStatusExtractorRewired.__get__('joinAndReformatData');
test('CSVCancerDiseaseStatusExtractor -> joinAndReformatData', () => {
  const localData = _.cloneDeep(exampleCSVDiseaseStatusModuleResponse);
  // Test that valid data works fine
  expect(joinAndReformatData(exampleCSVDiseaseStatusModuleResponse)).toEqual(expect.anything());

  // Test all required properties are
  delete localData[0].mrn;
  expect(() => joinAndReformatData(localData)).toThrow(
    new Error('DiseaseStatusData missing an expected property: mrn, conditionId, diseaseStatus and dateOfObservation are required.'),
  );
  localData[0].mrn = exampleCSVDiseaseStatusModuleResponse[0].mrn;
  expect(joinAndReformatData(localData)).toEqual(expect.anything());

  delete localData[0].conditionId;
  expect(() => joinAndReformatData(localData)).toThrow(
    new Error('DiseaseStatusData missing an expected property: mrn, conditionId, diseaseStatus and dateOfObservation are required.'),
  );
  localData[0].conditionId = exampleCSVDiseaseStatusModuleResponse[0].conditionId;
  expect(joinAndReformatData(localData)).toEqual(expect.anything());

  delete localData[0].diseaseStatus;
  expect(() => joinAndReformatData(localData)).toThrow(
    new Error('DiseaseStatusData missing an expected property: mrn, conditionId, diseaseStatus and dateOfObservation are required.'),
  );
  localData[0].diseaseStatus = exampleCSVDiseaseStatusModuleResponse[0].diseaseStatus;
  expect(joinAndReformatData(localData)).toEqual(expect.anything());

  delete localData[0].dateOfObservation;
  expect(() => joinAndReformatData(localData)).toThrow(
    new Error('DiseaseStatusData missing an expected property: mrn, conditionId, diseaseStatus and dateOfObservation are required.'),
  );
  localData[0].dateOfObservation = exampleCSVDiseaseStatusModuleResponse[0].dateOfObservation;
  expect(joinAndReformatData(localData)).toEqual(expect.anything());
});

test('CSVCancerDiseaseStatusExtractor returns bundle with Observation', async () => {
  csvModuleSpy.mockImplementation(() => exampleCSVDiseaseStatusModuleResponse);
  const data = await csvCancerDiseaseStatusExtractor.get({ mrn: MOCK_PATIENT_MRN });
  expect(data.resourceType).toEqual('Bundle');
  expect(data.type).toEqual('collection');
  expect(data.entry).toBeDefined();
  expect(data.entry.length).toEqual(1);
  expect(data.entry).toEqual(exampleCSVDiseaseStatusBundle.entry);
});

test('CSVCancerDiseaseStatusExtractor returns empty bundle when no data available from module', async () => {
  csvModuleSpy.mockImplementation(() => []);
  const data = await csvCancerDiseaseStatusExtractor.get({ mrn: MOCK_PATIENT_MRN });
  expect(data.resourceType).toEqual('Bundle');
  expect(data.type).toEqual('collection');
  expect(data.total).toEqual(0);
  expect(data.entry).toBeDefined();
  expect(data.entry.length).toEqual(0);
});
