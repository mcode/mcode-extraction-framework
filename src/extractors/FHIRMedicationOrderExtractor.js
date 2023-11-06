const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRMedicationOrderExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, searchParameters }) {
    super({ baseFhirUrl, requestHeaders, version, searchParameters });
    this.resourceType = 'MedicationOrder';
  }
}

module.exports = {
  FHIRMedicationOrderExtractor,
};
