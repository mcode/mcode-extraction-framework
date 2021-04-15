const path = require('path');
const _ = require('lodash');
const { CSVClinicalTrialInformationExtractor } = require('../../src/extractors');
const exampleClinicalTrialInformationResponse = require('./fixtures/csv-clinical-trial-information-module-response.json');
const exampleClinicalTrialInformationBundle = require('./fixtures/csv-clinical-trial-information-bundle.json');
const { getPatientFromContext } = require('../../src/helpers/contextUtils');
const MOCK_CONTEXT = require('./fixtures/context-with-patient.json');

// Constants for mock tests
const MOCK_PATIENT_MRN = 'mrn-1'; // linked to values in example-module-response and context-with-patient above
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error
const MOCK_CLINICAL_SITE_ID = 'EXAMPLE-CLINICAL-SITE-ID';
const MOCK_CLINICAL_SITE_SYSTEM = 'EXAMPLE-CLINICAL-SITE-SYSTEM';

// Instantiate module with mock parameters
const csvClinicalTrialInformationExtractor = new CSVClinicalTrialInformationExtractor({
  filePath: MOCK_CSV_PATH,
  clinicalSiteID: MOCK_CLINICAL_SITE_ID,
  clinicalSiteSystem: MOCK_CLINICAL_SITE_SYSTEM,
});

// Destructure all modules
const { csvModule } = csvClinicalTrialInformationExtractor;

// Spy on csvModule
const csvModuleSpy = jest.spyOn(csvModule, 'get');
csvModuleSpy
  .mockReturnValue(exampleClinicalTrialInformationResponse);

describe('CSVClinicalTrialInformationExtractor', () => {
  describe('joinClinicalTrialData', () => {
    test('should join clinical trial data appropriately and throw errors when missing required properties', () => {
      const firstClinicalTrialInfoResponse = exampleClinicalTrialInformationResponse[0]; // Each patient will only have one entry per clinical trial
      const expectedErrorString = 'Clinical trial missing an expected property: clinicalSiteID, trialSubjectID, enrollmentStatus, trialResearchID, and trialStatus are required.';
      const patientId = getPatientFromContext(MOCK_CONTEXT).id;

      // Test required properties in CSV throw error
      Object.keys(firstClinicalTrialInfoResponse).forEach((key) => {
        const clonedData = _.cloneDeep(firstClinicalTrialInfoResponse);
        expect(csvClinicalTrialInformationExtractor.joinClinicalTrialData(clonedData, patientId)).toEqual(expect.anything());
        if (key === 'patientId') return; // MRN is optional
        if (key === 'trialResearchSystem') return; // trialResearchSystem is optional
        delete clonedData[key];
        expect(() => csvClinicalTrialInformationExtractor.joinClinicalTrialData(clonedData, patientId)).toThrow(new Error(expectedErrorString));
      });

      // joinClinicalTrialData should return correct format
      expect(csvClinicalTrialInformationExtractor.joinClinicalTrialData(firstClinicalTrialInfoResponse, patientId)).toEqual({
        formattedDataSubject: {
          enrollmentStatus: firstClinicalTrialInfoResponse.enrollmentStatus,
          trialSubjectID: firstClinicalTrialInfoResponse.trialSubjectID,
          trialResearchID: firstClinicalTrialInfoResponse.trialResearchID,
          patientId,
          trialResearchSystem: firstClinicalTrialInfoResponse.trialResearchSystem,
        },
        formattedDataStudy: {
          trialStatus: firstClinicalTrialInfoResponse.trialStatus,
          trialResearchID: firstClinicalTrialInfoResponse.trialResearchID,
          clinicalSiteID: MOCK_CLINICAL_SITE_ID,
          clinicalSiteSystem: MOCK_CLINICAL_SITE_SYSTEM,
          trialResearchSystem: firstClinicalTrialInfoResponse.trialResearchSystem,
        },
      });
    });
  });

  describe('get', () => {
    test('should return a bundle with the correct resources', async () => {
      const data = await csvClinicalTrialInformationExtractor.get({ mrn: MOCK_PATIENT_MRN, context: MOCK_CONTEXT });

      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(2);
      expect(data.entry).toEqual(exampleClinicalTrialInformationBundle.entry);
    });
  });
});
