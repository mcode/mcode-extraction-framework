const _ = require('lodash');
const path = require('path');
const { extractDataForPatients } = require('../../src/cli/mcodeExtraction');
const { MCODEClient } = require('../../src/client/MCODEClient');
const testBundle = require('./fixtures/test-bundle.json');

// Utility for flattening error values
function flattenErrorValues(errorValues) {
  return _.flatten(Object.values(errorValues));
}

describe('mcodeExtraction', () => {
  describe('extractDataForPatients', () => {
    const mockMcodeClient = {
      get: jest.fn(),
    };
    const testPatientIds = ['123', '456', '789'];
    const testFromDate = '2020-01-01';
    const testToDate = '2020-06-30';

    it('should return extracted data when client successful returns a message bundle', async () => {
      mockMcodeClient.get.mockClear();
      mockMcodeClient.get.mockReturnValue({ bundle: testBundle, extractionErrors: [] });
      const { extractedData, successfulExtraction, totalExtractionErrors } = await extractDataForPatients(testPatientIds, mockMcodeClient, testFromDate, testToDate);
      expect(successfulExtraction).toEqual(true);
      const flattenedErrorValues = flattenErrorValues(totalExtractionErrors);
      expect(flattenedErrorValues).toEqual([]);
      expect(mockMcodeClient.get).toHaveBeenCalledTimes(testPatientIds.length);
      expect(extractedData).toEqual(expect.arrayContaining([testBundle]));
    });

    it('should fail to execute if a fatal error is produced in the extracting data', async () => {
      const fatalError = new Error('Fatal error');

      mockMcodeClient.get.mockClear();
      mockMcodeClient.get.mockImplementation(() => { throw fatalError; });

      const { extractedData, successfulExtraction, totalExtractionErrors } = await extractDataForPatients(testPatientIds, mockMcodeClient, testFromDate, testToDate);
      expect(mockMcodeClient.get).toHaveBeenCalledTimes(testPatientIds.length);
      expect(successfulExtraction).toEqual(false);
      const flatErrors = flattenErrorValues(totalExtractionErrors);
      expect(flatErrors).toHaveLength(testPatientIds.length);
      expect(extractedData).toHaveLength(0);
    });

    it('should succeed in extraction when CSV files do not have data for all patients', async () => {
      const testConfig = {
        extractors: [
          {
            label: 'patients',
            type: 'CSVPatientExtractor',
            constructorArgs: {
              filePath: path.join(__dirname, './fixtures/example-patient.csv'),
            },
          },
          {
            label: 'condition',
            type: 'CSVConditionExtractor',
            constructorArgs: {
              // This csv is missing the first mrn but has the other two mrns, thus it should result in a single non-fatal error
              filePath: path.join(__dirname, './fixtures/example-condition.csv'),
            },
          },
          {
            label: 'cancerDiseaseStatus',
            type: 'CSVCancerDiseaseStatusExtractor',
            constructorArgs: {
              filePath: path.join(__dirname, './fixtures/example-disease-status.csv'),
            },
          },
        ],
      };

      const testClient = new MCODEClient(testConfig);
      await testClient.init();

      const { extractedData, successfulExtraction, totalExtractionErrors } = await extractDataForPatients(testPatientIds, testClient, testFromDate, testToDate);
      expect(successfulExtraction).toEqual(true);
      // Should have data for 3 patients and 0 errors
      expect(extractedData).toHaveLength(3);
      const flatErrors = flattenErrorValues(totalExtractionErrors);
      expect(flatErrors).toHaveLength(0);
    });
    it('should result in a successful extraction when non fatal errors are encountered in the client\'s get method', async () => {
      const testConfig = {
        extractors: [
          // Should fail when this extractor is run without patient data in context
          {
            label: 'CTI',
            type: 'CSVClinicalTrialInformationExtractor',
            constructorArgs: {
              filePath: path.join(__dirname, './fixtures/example-clinical-trial-info.csv'),
            },
          },
        ],
      };

      const testClient = new MCODEClient(testConfig);
      await testClient.init();

      const { extractedData, successfulExtraction, totalExtractionErrors } = await extractDataForPatients(testPatientIds, testClient, testFromDate, testToDate);
      expect(successfulExtraction).toEqual(true);
      // Should have three (empty) bundles for patients and an error for each patient when extracting CTI
      expect(extractedData).toHaveLength(3);
      const flatErrors = flattenErrorValues(totalExtractionErrors);
      expect(flatErrors).toHaveLength(3);
    });
  });
});
