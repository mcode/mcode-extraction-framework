const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

const BASE_CLINICAL_STATUS = 'active';

class FHIRAllergyIntoleranceExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, clinicalStatus }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'AllergyIntolerance';
    this.clinicalStatus = clinicalStatus || BASE_CLINICAL_STATUS;
  }

  // In addition to default parametrization, add clinical status
  async parametrizeArgsForFHIRModule({ mrn, context }) {
    const paramsWithID = await super.parametrizeArgsForFHIRModule({ mrn, context });
    return {
      ...paramsWithID,
      'clinical-status': BASE_CLINICAL_STATUS,
    };
  }
}

module.exports = {
  FHIRAllergyIntoleranceExtractor,
};
