const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRObservationExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, category, searchParameters }) {
    super({ baseFhirUrl, requestHeaders, version, searchParameters });
    this.resourceType = 'Observation';
  }

}

module.exports = {
  FHIRObservationExtractor,
};
