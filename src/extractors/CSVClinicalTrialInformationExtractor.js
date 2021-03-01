const path = require('path');
const { Extractor } = require('./Extractor');
const { CSVModule } = require('../modules');
const { firstEntryInBundle, getBundleResourcesByType } = require('../helpers/fhirUtils');
const { generateMcodeResources } = require('../templates');
const logger = require('../helpers/logger');

function getPatientId(context) {
  const patientInContext = getBundleResourcesByType(context, 'Patient', {}, true);
  if (patientInContext) {
    logger.debug('Patient resource found in context.');
    return patientInContext.id;
  }

  logger.debug('No patient resource found in context.');
  return undefined;
}

class CSVClinicalTrialInformationExtractor extends Extractor {
  constructor({ filePath, clinicalSiteID }) {
    super();
    this.csvModule = new CSVModule(path.resolve(filePath));
    if (!clinicalSiteID) logger.warn(`${this.constructor.name} expects a value for clinicalSiteID but got ${clinicalSiteID}`);
    this.clinicalSiteID = clinicalSiteID;
  }

  joinClinicalTrialData(patientId, clinicalTrialData) {
    logger.debug('Reformatting clinical trial data from CSV into template format');
    let {
      trialSubjectID, enrollmentStatus, trialResearchID, trialStatus, trialResearchSystem,
    } = clinicalTrialData;
    const { clinicalSiteID } = this;

    if (!(patientId && clinicalSiteID && trialSubjectID && enrollmentStatus && trialResearchID && trialStatus)) {
      throw new Error('Clinical trial missing an expected property: patientId, clinicalSiteID, trialSubjectID, enrollmentStatus, trialResearchID, and trialStatus are required.');
    }

    //since trialResearchSystem is optional, check for blank value and replace with default value
    trialResearchSystem = (trialResearchSystem === '') ? 'http://example.com/clinicaltrialids' : trialResearchSystem;

    // Need separate data objects for ResearchSubject and ResearchStudy so that they get different resource ids
    return {
      formattedDataSubject: {
        enrollmentStatus,
        trialSubjectID,
        trialResearchID,
        patientId,
        trialResearchSystem,
      },
      formattedDataStudy: {
        trialStatus,
        trialResearchID,
        clinicalSiteID,
        trialResearchSystem,
      },
    };
  }

  async getClinicalTrialData(mrn) {
    logger.debug('Getting clinical trial data');
    const data = await this.csvModule.get('mrn', mrn);
    // Should only be one value return for clinical trial data
    return data[0];
  }

  async get({ mrn, context }) {
    const patientId = getPatientId(context) || mrn;
    const clinicalTrialData = await this.getClinicalTrialData(mrn);

    // Format data for research study and research subject
    const formattedData = this.joinClinicalTrialData(patientId, clinicalTrialData);
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
