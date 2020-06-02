const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRProcedureExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'Procedure';
  }
}

module.exports = {
  FHIRProcedureExtractor,
};
