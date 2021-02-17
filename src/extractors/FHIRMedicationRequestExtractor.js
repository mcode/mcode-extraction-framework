const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

const BASE_STATUSES = ''; // No status specified, returns all statuses (on-hold, completed, stopped, active)

class FHIRMedicationRequestExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, status }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'MedicationRequest';
    this.status = status || BASE_STATUSES;
  }

  // In addition to default parametrization, add status if specified
  async parametrizeArgsForFHIRModule({ context }) {
    const paramsWithID = await super.parametrizeArgsForFHIRModule({ context });
    // Only add status to parameters if it has been specified
    return {
      ...paramsWithID,
      ...(this.status && { status: this.status }),
    };
  }
}

module.exports = {
  FHIRMedicationRequestExtractor,
};
