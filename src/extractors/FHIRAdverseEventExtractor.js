const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

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
    // The patient is referenced in the 'subject' field of an AdverseEvent
    paramsWithID.subject = paramsWithID.patient;
    delete paramsWithID.patient;
    // Only add study to parameters if it has been specified
    return {
      ...paramsWithID,
      ...(this.study && { study: this.study }),
    };
  }
}

module.exports = {
  FHIRAdverseEventExtractor,
};
