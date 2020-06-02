const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVClinicalTrialInformationExtractor } = require('../../src/extractors');
const exampleClinicalTrialInformationResponse = require('./fixtures/csv-clinical-trial-information-module-response.json');
const exampleClinicalTrialInformationBundle = require('./fixtures/csv-clinical-trial-information-bundle.json');

// Constants for mock tests
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error

const MOCK_PATIENT_MRN = 'EXAMPLE-MRN';

// Instantiate module with mock parameters
const csvClinicalTrialInformationExtractor = new CSVClinicalTrialInformationExtractor({
  filePath: MOCK_CSV_PATH,
});

// Destructure all modules
const { csvModule } = csvClinicalTrialInformationExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');
csvModuleSpy
  .mockReturnValue(exampleClinicalTrialInformationResponse);

const joinClinicalTrialData = rewire('../../src/extractors/CSVClinicalTrialInformationExtractor.js').__get__('joinClinicalTrialData');

describe('CSVClinicalTrialInformationExtractor', () => {
  test('should join clinical trial data appropriately', () => {
    const firstClinicalTrialInfoResponse = exampleClinicalTrialInformationResponse[0]; // Each patient will only have one entry per clinical trial
    const expectedErrorString = 'Clinical trial missing an expected property: patientId, trialSubjectID, enrollmentStatus, trialResearchID, and trialStatus are required.';

    // Test required properties in CSV throw error
    Object.keys(firstClinicalTrialInfoResponse).forEach((key) => {
      const clonedData = _.cloneDeep(firstClinicalTrialInfoResponse);
      expect(joinClinicalTrialData(MOCK_PATIENT_MRN, clonedData)).toEqual(expect.anything());
      if (key === 'mrn') return; // MRN is not required from CSV
      delete clonedData[key];
      expect(() => joinClinicalTrialData(MOCK_PATIENT_MRN, clonedData)).toThrow(new Error(expectedErrorString));
    });

    // patientId is required to be passed in
    expect(() => joinClinicalTrialData(undefined, firstClinicalTrialInfoResponse)).toThrow(new Error(expectedErrorString));

    // joinClinicalTrialData should return correct format
    expect(joinClinicalTrialData(MOCK_PATIENT_MRN, firstClinicalTrialInfoResponse)).toEqual({
      formattedDataSubject: {
        enrollmentStatus: firstClinicalTrialInfoResponse.enrollmentStatus,
        trialSubjectID: firstClinicalTrialInfoResponse.trialSubjectID,
        trialResearchID: firstClinicalTrialInfoResponse.trialResearchID,
        patientId: MOCK_PATIENT_MRN,
      },
      formattedDataStudy: {
        trialStatus: firstClinicalTrialInfoResponse.trialStatus,
        trialResearchID: firstClinicalTrialInfoResponse.trialResearchID,
      },
    });
  });

  test('should return a bundle with the correct resources', async () => {
    const data = await csvClinicalTrialInformationExtractor.get({ mrn: MOCK_PATIENT_MRN });

    expect(data.resourceType).toEqual('Bundle');
    expect(data.type).toEqual('collection');
    expect(data.entry).toBeDefined();
    expect(data.entry.length).toEqual(2);
    expect(data.entry).toEqual(exampleClinicalTrialInformationBundle.entry);
  });
});
