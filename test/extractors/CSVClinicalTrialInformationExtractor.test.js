const path = require('path');
const rewire = require('rewire');
const _ = require('lodash');
const { CSVClinicalTrialInformationExtractor } = require('../../src/extractors');
const exampleClinicalTrialInformationResponse = require('./fixtures/csv-clinical-trial-information-module-response.json');
const exampleClinicalTrialInformationBundle = require('./fixtures/csv-clinical-trial-information-bundle.json');

// Constants for mock tests
const MOCK_CSV_PATH = path.join(__dirname, 'fixtures/example.csv'); // need a valid path/csv here to avoid parse error
const MOCK_CLINICAL_SITE_ID = 'EXAMPLE-CLINICAL-SITE-ID';
const MOCK_CLINICAL_SITE_SYSTEM = 'EXAMPLE-CLINICAL-SITE-SYSTEM';
const MOCK_PATIENT_MRN = 'EXAMPLE-MRN';

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

const getPatientId = rewire('../../src/extractors/CSVClinicalTrialInformationExtractor.js').__get__('getPatientId');

describe('CSVClinicalTrialInformationExtractor', () => {
  describe('joinClinicalTrialData', () => {
    test('should join clinical trial data appropriately and throw errors when missing required properties', () => {
      const firstClinicalTrialInfoResponse = exampleClinicalTrialInformationResponse[0]; // Each patient will only have one entry per clinical trial
      const expectedErrorString = 'Clinical trial missing an expected property: patientId, clinicalSiteID, trialSubjectID, enrollmentStatus, trialResearchID, and trialStatus are required.';

      // Test required properties in CSV throw error
      Object.keys(firstClinicalTrialInfoResponse).forEach((key) => {
        const clonedData = _.cloneDeep(firstClinicalTrialInfoResponse);
        expect(csvClinicalTrialInformationExtractor.joinClinicalTrialData(MOCK_PATIENT_MRN, clonedData)).toEqual(expect.anything());
        if (key === 'mrn') return; // MRN is not required from CSV
        if (key === 'trialResearchSystem') return; // trialResearchSystem is an optional field
        delete clonedData[key];
        expect(() => csvClinicalTrialInformationExtractor.joinClinicalTrialData(MOCK_PATIENT_MRN, clonedData)).toThrow(new Error(expectedErrorString));
      });

      // patientId is required to be passed in
      expect(() => csvClinicalTrialInformationExtractor.joinClinicalTrialData(undefined, firstClinicalTrialInfoResponse)).toThrow(new Error(expectedErrorString));

      // joinClinicalTrialData should return correct format
      expect(csvClinicalTrialInformationExtractor.joinClinicalTrialData(MOCK_PATIENT_MRN, firstClinicalTrialInfoResponse)).toEqual({
        formattedDataSubject: {
          enrollmentStatus: firstClinicalTrialInfoResponse.enrollmentStatus,
          trialSubjectID: firstClinicalTrialInfoResponse.trialSubjectID,
          trialResearchID: firstClinicalTrialInfoResponse.trialResearchID,
          patientId: MOCK_PATIENT_MRN,
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

  describe('getPatientId', () => {
    test('should return patient id when patient resource in context', () => {
      const contextPatient = {
        resourceType: 'Patient',
        id: 'context-patient-id',
      };
      const contextBundle = {
        resourceType: 'Bundle',
        type: 'collection',
        entry: [
          {
            fullUrl: 'context-url',
            resource: contextPatient,
          },
        ],
      };

      const patientId = getPatientId(contextBundle);
      expect(patientId).toEqual(contextPatient.id);
    });

    test('getPatientId should return undefined when no patient resource in context', () => {
      const patientId = getPatientId({});
      expect(patientId).toBeUndefined();
    });
  });

  describe('get', () => {
    test('should return a bundle with the correct resources', async () => {
      const data = await csvClinicalTrialInformationExtractor.get({ mrn: MOCK_PATIENT_MRN });

      expect(data.resourceType).toEqual('Bundle');
      expect(data.type).toEqual('collection');
      expect(data.entry).toBeDefined();
      expect(data.entry.length).toEqual(2);
      expect(data.entry).toEqual(exampleClinicalTrialInformationBundle.entry);
    });
  });
});
