const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRAdverseEventExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'AdverseEvent';
  }
}

module.exports = {
  FHIRAdverseEventExtractor,
};
