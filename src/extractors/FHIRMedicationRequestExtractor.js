const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRMedicationRequestExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, status, searchParameters }) {
    super({ baseFhirUrl, requestHeaders, version, searchParameters });
    this.resourceType = 'MedicationRequest';
  }
}

module.exports = {
  FHIRMedicationRequestExtractor,
};
