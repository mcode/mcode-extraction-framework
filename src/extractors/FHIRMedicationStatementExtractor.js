const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRMedicationStatementExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, searchParameters }) {
    super({ baseFhirUrl, requestHeaders, version, searchParameters });
    this.resourceType = 'MedicationStatement';
  }
}

module.exports = {
  FHIRMedicationStatementExtractor,
};
