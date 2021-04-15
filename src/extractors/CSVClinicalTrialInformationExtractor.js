const _ = require('lodash');
const { BaseCSVExtractor } = require('./BaseCSVExtractor');
const { firstEntryInBundle, getEmptyBundle } = require('../helpers/fhirUtils');
const { getPatientFromContext } = require('../helpers/contextUtils');
const { generateMcodeResources } = require('../templates');
const logger = require('../helpers/logger');
const { CSVClinicalTrialInformationSchema } = require('../helpers/schemas/csv');


class CSVClinicalTrialInformationExtractor extends BaseCSVExtractor {
  constructor({ filePath, clinicalSiteID, clinicalSiteSystem }) {
    super({ filePath, csvSchema: CSVClinicalTrialInformationSchema });
    if (!clinicalSiteID) logger.warn(`${this.constructor.name} expects a value for clinicalSiteID but got ${clinicalSiteID}`);
    this.clinicalSiteID = clinicalSiteID;
    this.clinicalSiteSystem = clinicalSiteSystem;
  }

  joinClinicalTrialData(clinicalTrialData, patientId) {
    logger.debug('Reformatting clinical trial data from CSV into template format');
    const {
      trialSubjectID, enrollmentStatus, trialResearchID, trialStatus, trialResearchSystem,
    } = clinicalTrialData;
    const { clinicalSiteID, clinicalSiteSystem } = this;

    if (!(clinicalSiteID && trialSubjectID && enrollmentStatus && trialResearchID && trialStatus)) {
      throw new Error('Clinical trial missing an expected property: clinicalSiteID, trialSubjectID, enrollmentStatus, trialResearchID, and trialStatus are required.');
    }

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
        clinicalSiteSystem,
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
    const clinicalTrialData = await this.getClinicalTrialData(mrn);
    if (_.isEmpty(clinicalTrialData)) {
      logger.warn('No clinicalTrial record found for patient');
      return getEmptyBundle();
    }
    const patientId = getPatientFromContext(context).id;

    // Format data for research study and research subject
    const formattedData = this.joinClinicalTrialData(clinicalTrialData, patientId);
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
