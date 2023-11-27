const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIREncounterExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, searchParameters }) {
    super({ baseFhirUrl, requestHeaders, version, searchParameters });
    this.resourceType = 'Encounter';
  }
}

module.exports = {
  FHIREncounterExtractor,
};
