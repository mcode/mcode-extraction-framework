const { Extractor } = require('./Extractor');
const { BaseFHIRModule, CSVModule } = require('../modules');
const { isBundleEmpty, firstResourceInBundle, firstEntryInBundle } = require('../helpers/fhirUtils');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const logger = require('../helpers/logger');

function joinClinicalTrialData(patientId, clinicalTrialData) {
  const { trialSubjectID, enrollmentStatus, trialResearchID, trialStatus } = clinicalTrialData;

  // Need separate data objects for ResearchSubject and ResearchStudy so that they get different resource ids
  return {
    formattedDataSubject: {
      enrollmentStatus,
      trialSubjectID,
      trialResearchID,
      patientId,
    },
    formattedDataStudy: {
      trialStatus,
      trialResearchID,
    },
  };
}

class CSVClinicalTrialInformationExtractor extends Extractor {
  constructor(baseFhirUrl, requestHeaders, clinicalTrialCSVPath) {
    super();
    this.csvModule = new CSVModule(clinicalTrialCSVPath);
    this.baseFHIRModule = new BaseFHIRModule(baseFhirUrl, requestHeaders);
  }

  updateRequestHeaders(newHeaders) {
    this.baseFHIRModule.updateRequestHeaders(newHeaders);
  }

  async getPatient(mrn) {
    logger.info('Getting patient information for patient by MRN');
    const patientSearchSet = await this.baseFHIRModule.search('Patient', { identifier: mrn });
    if (isBundleEmpty(patientSearchSet)) {
      throw Error('Patient search bundle that was supposed to have entries had 0');
    }
    logger.info(`Found ${patientSearchSet.total} result(s) in Patient search`);
    return firstResourceInBundle(patientSearchSet);
  }

  async getClinicalTrialData(mrn) {
    logger.info('Getting clinical trial data');
    const data = await this.csvModule.get('mrn', mrn);
    // Should only be one value return for clinical trial data
    return data[0];
  }

  async get({ mrn }) {
    const patient = await this.getPatient(mrn);
    const clinicalTrialData = await this.getClinicalTrialData(mrn);

    // Format data for research study and research subject
    const formattedData = joinClinicalTrialData(patient.id, clinicalTrialData);
    const { formattedDataSubject, formattedDataStudy } = formattedData;

    // Generate ResearchSubject and ResearchStudy resources and combine into one bundle to return
    const researchSubject = firstEntryInBundle(generateMcodeResources('ResearchSubject', formattedDataSubject));
    const researchStudy = firstEntryInBundle(generateMcodeResources('ResearchStudy', formattedDataStudy));

    return {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [researchSubject, researchStudy],
    };
  }
}

module.exports = {
  CSVClinicalTrialInformationExtractor,
};
