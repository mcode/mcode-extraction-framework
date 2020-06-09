const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

const BASE_CATEGORIES = 'problem-list-item';

class FHIRConditionExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, category }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'Condition';
    this.category = category || BASE_CATEGORIES;
  }

  // In addition to default parametrization, add category
  async parametrizeArgsForFHIRModule({ mrn, context }) {
    const paramsWithID = await super.parametrizeArgsForFHIRModule({ mrn, context });
    return {
      ...paramsWithID,
      category: this.category,
    };
  }
}

module.exports = {
  FHIRConditionExtractor,
};
