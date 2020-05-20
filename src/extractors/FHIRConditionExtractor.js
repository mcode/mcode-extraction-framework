const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRConditionExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'Condition';
  }
}

module.exports = {
  FHIRConditionExtractor,
};
