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
csvModuleSpy
  .mockReturnValue(exampleCSVDiseaseStatusModuleResponse);

const joinAndReformatData = CSVCancerDiseaseStatusExtractorRewired.__get__('joinAndReformatData');
test('CSVCancerDiseaseStatusExtractor -> joinAndReformatData', () => {
  const localData = _.cloneDeep(exampleCSVDiseaseStatusModuleResponse);
  // Test that valid data works fine
  expect(joinAndReformatData(exampleCSVDiseaseStatusModuleResponse)).toEqual(expect.anything());

  // Test all required properties are
  delete localData[0].mrn;
  expect(() => joinAndReformatData(localData)).toThrow(
    new Error('DiseaseStatusData missing an expected property: mrn, subjectId, conditionId, diseaseStatus and dateOfObservation are required.'),
  );
  localData[0].mrn = exampleCSVDiseaseStatusModuleResponse[0].mrn;
  expect(joinAndReformatData(localData)).toEqual(expect.anything());

  delete localData[0].subjectId;
  expect(() => joinAndReformatData(localData)).toThrow(
    new Error('DiseaseStatusData missing an expected property: mrn, subjectId, conditionId, diseaseStatus and dateOfObservation are required.'),
  );
  localData[0].subjectId = exampleCSVDiseaseStatusModuleResponse[0].subjectId;
  expect(joinAndReformatData(localData)).toEqual(expect.anything());

  delete localData[0].conditionId;
  expect(() => joinAndReformatData(localData)).toThrow(
    new Error('DiseaseStatusData missing an expected property: mrn, subjectId, conditionId, diseaseStatus and dateOfObservation are required.'),
  );
  localData[0].conditionId = exampleCSVDiseaseStatusModuleResponse[0].conditionId;
  expect(joinAndReformatData(localData)).toEqual(expect.anything());

  delete localData[0].diseaseStatus;
  expect(() => joinAndReformatData(localData)).toThrow(
    new Error('DiseaseStatusData missing an expected property: mrn, subjectId, conditionId, diseaseStatus and dateOfObservation are required.'),
  );
  localData[0].diseaseStatus = exampleCSVDiseaseStatusModuleResponse[0].diseaseStatus;
  expect(joinAndReformatData(localData)).toEqual(expect.anything());

  delete localData[0].dateOfObservation;
  expect(() => joinAndReformatData(localData)).toThrow(
    new Error('DiseaseStatusData missing an expected property: mrn, subjectId, conditionId, diseaseStatus and dateOfObservation are required.'),
  );
  localData[0].dateOfObservation = exampleCSVDiseaseStatusModuleResponse[0].dateOfObservation;
  expect(joinAndReformatData(localData)).toEqual(expect.anything());
});

test('CSVCancerDiseaseStatusExtractor', async () => {
  const data = await csvCancerDiseaseStatusExtractor.get({ mrn: MOCK_PATIENT_MRN });
  expect(data.resourceType).toEqual('Bundle');
  expect(data.type).toEqual('collection');
  expect(data.entry).toBeDefined();
  expect(data.entry.length).toEqual(1);
  expect(data.entry).toEqual(exampleCSVDiseaseStatusBundle.entry);
});
