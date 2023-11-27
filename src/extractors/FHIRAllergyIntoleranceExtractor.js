const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');


class FHIRAllergyIntoleranceExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, searchParameters }) {
    super({ baseFhirUrl, requestHeaders, version, searchParameters });
    this.resourceType = 'AllergyIntolerance';
  }
}

module.exports = {
  FHIRAllergyIntoleranceExtractor,
};
