const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRMedicationStatementExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'MedicationStatement';
  }
}

module.exports = {
  FHIRMedicationStatementExtractor,
};
