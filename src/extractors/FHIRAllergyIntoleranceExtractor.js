const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

const BASE_CLINICAL_STATUS = 'active';

class FHIRAllergyIntoleranceExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, clinicalStatus }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'AllergyIntolerance';
    this.clinicalStatus = clinicalStatus || BASE_CLINICAL_STATUS;
  }

  // In addition to default parametrization, add clinical status
  async parametrizeArgsForFHIRModule({ context }) {
    const paramsWithID = await super.parametrizeArgsForFHIRModule({ context });
    return {
      ...paramsWithID,
      'clinical-status': this.clinicalStatus,
    };
  }
}

module.exports = {
  FHIRAllergyIntoleranceExtractor,
};
