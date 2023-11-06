const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRDocumentReferenceExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, searchParameters }) {
    super({ baseFhirUrl, requestHeaders, version,searchParameters });
    this.resourceType = 'DocumentReference';
  }
}

module.exports = {
  FHIRDocumentReferenceExtractor,
};
