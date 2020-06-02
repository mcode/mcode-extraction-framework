const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');

class FHIRPatientExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'Patient';
  }

  // Override default behavior for PatientExtractor; just use MRN directly
  // eslint-disable-next-line class-methods-use-this
  async parametrizeArgsForFHIRModule({ mrn }) {
    return {
      identifier: mrn,
    };
  }
}

module.exports = {
  FHIRPatientExtractor,
};
