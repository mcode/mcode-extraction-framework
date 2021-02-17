const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIREncounterExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'Encounter';
  }
}

module.exports = {
  FHIREncounterExtractor,
};
