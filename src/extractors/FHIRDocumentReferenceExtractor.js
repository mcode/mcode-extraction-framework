const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRDocumentReferenceExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'DocumentReference';
  }
}

module.exports = {
  FHIRDocumentReferenceExtractor,
};
