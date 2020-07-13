const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

const BASE_CATEGORIES = 'problem-list-item';
const BASE_STATUSES = ''; // No status specified, returns all statuses (active, resolved, inactive)

class FHIRConditionExtractor extends BaseFHIRExtractor {
  constructor({
    baseFhirUrl,
    requestHeaders,
    version,
    category,
    status,
  }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'Condition';
    this.category = category || BASE_CATEGORIES;
    this.status = status || BASE_STATUSES;
  }

  // In addition to default parametrization, add category
  async parametrizeArgsForFHIRModule({ mrn, context }) {
    const paramsWithID = await super.parametrizeArgsForFHIRModule({ mrn, context });
    return {
      ...paramsWithID,
      category: this.category,
      ...(this.status && { 'clinical-status': this.status }),
    };
  }
}

module.exports = {
  FHIRConditionExtractor,
};
