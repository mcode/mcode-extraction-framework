const path = require('path');
const { Extractor } = require('./Extractor');
const { CSVModule } = require('../modules');
const { firstEntryInBundle, getBundleResourcesByType } = require('../helpers/fhirUtils');
const { generateMcodeResources } = require('../helpers/ejsUtils');
const logger = require('../helpers/logger');

function joinClinicalTrialData(patientId, clinicalTrialData) {
  const { trialSubjectID, enrollmentStatus, trialResearchID, trialStatus } = clinicalTrialData;

  if (!(patientId && trialSubjectID && enrollmentStatus && trialResearchID && trialStatus)) {
    throw new Error('Clinical trial missing an expected property: patientId, trialSubjectID, enrollmentStatus, trialResearchID, and trialStatus are required.');
  }

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

function getPatientId(context) {
  const patientInContext = getBundleResourcesByType(context, 'Patient', {}, true);
  return patientInContext ? patientInContext.id : undefined;
}

class CSVClinicalTrialInformationExtractor extends Extractor {
  constructor({ filePath }) {
    super();
    this.csvModule = new CSVModule(path.resolve(filePath));
  }

  async getClinicalTrialData(mrn) {
    logger.info('Getting clinical trial data');
    const data = await this.csvModule.get('mrn', mrn);
    // Should only be one value return for clinical trial data
    return data[0];
  }

  async get({ mrn, context }) {
    const patientId = getPatientId(context) || mrn;
    const clinicalTrialData = await this.getClinicalTrialData(mrn);

    // Format data for research study and research subject
    const formattedData = joinClinicalTrialData(patientId, clinicalTrialData);
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
