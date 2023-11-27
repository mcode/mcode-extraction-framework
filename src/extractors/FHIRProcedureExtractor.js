const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRProcedureExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, searchParameters }) {
    super({ baseFhirUrl, requestHeaders, version, searchParameters });
    this.resourceType = 'Procedure';
  }
}

module.exports = {
  FHIRProcedureExtractor,
};
