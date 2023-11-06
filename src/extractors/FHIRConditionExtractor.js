const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRConditionExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, searchParameters}) {
    super({ baseFhirUrl, requestHeaders, version, searchParameters });
    this.resourceType = 'Condition';
  }

}

module.exports = {
  FHIRConditionExtractor,
};
