const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');
const { getResearchStudiesFromContext } = require('../helpers/contextUtils');
const logger = require('../helpers/logger');

const BASE_STUDY = ''; // No base study specified

class FHIRAdverseEventExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, study }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'AdverseEvent';
    this.study = study || BASE_STUDY;
  }

  // In addition to default parametrization, add study if specified
  async parametrizeArgsForFHIRModule({ context }) {
    const paramsWithID = await super.parametrizeArgsForFHIRModule({ context });
    let allResearchStudyResources = [];
    try {
      allResearchStudyResources = getResearchStudiesFromContext(context);
    } catch (e) {
      logger.error(e.message);
      logger.debug(e.stack);
    }

    // The patient is referenced in the 'subject' field of an AdverseEvent
    paramsWithID.subject = paramsWithID.patient;
    delete paramsWithID.patient;

    // If there are research study resources, create a parameters object for each call to be made
    const newStudyIds = allResearchStudyResources.map((rs) => rs.id).join(',');
    const studyIdsForCurrentPatient = `${this.study}${this.study && newStudyIds ? ',' : ''}${newStudyIds}`;

    // Only add study to parameters if it has been specified or was included from context
    const obj = {
      ...paramsWithID,
      ...(studyIdsForCurrentPatient && { study: studyIdsForCurrentPatient }),
    };
    return obj;
  }
}

module.exports = {
  FHIRAdverseEventExtractor,
};
