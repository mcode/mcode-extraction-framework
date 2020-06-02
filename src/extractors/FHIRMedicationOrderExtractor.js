const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRMedicationOrderExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'MedicationOrder';
  }
}

module.exports = {
  FHIRMedicationOrderExtractor,
};
