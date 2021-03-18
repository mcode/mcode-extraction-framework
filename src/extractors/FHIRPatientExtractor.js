const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');
const { maskPatientData } = require('../helpers/patientUtils.js');

class FHIRPatientExtractor extends BaseFHIRExtractor {
  constructor({ baseFhirUrl, requestHeaders, version, mask = [] }) {
    super({ baseFhirUrl, requestHeaders, version });
    this.resourceType = 'Patient';
    this.mask = mask;
  }

  // Override default behavior for PatientExtractor; just use MRN directly
  // eslint-disable-next-line class-methods-use-this
  async parametrizeArgsForFHIRModule({ mrn }) {
    return {
      identifier: `MRN|${mrn}`,
    };
  }

  async get(argumentObject) {
    const bundle = await super.get(argumentObject);
    if (this.mask.length > 0) maskPatientData(bundle, this.mask);
    return bundle;
  }
}

module.exports = {
  FHIRPatientExtractor,
};
