const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRAllergyIntoleranceExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'AllergyIntolerance';
  }
}

module.exports = {
  FHIRAllergyIntoleranceExtractor,
};
