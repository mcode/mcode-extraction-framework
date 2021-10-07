const { BaseFHIRExtractor } = require('./BaseFHIRExtractor');
const { maskPatientData } = require('../helpers/patientUtils.js');

const ALL_SUPPORTED_MASK_FIELDS = [
  'gender',
  'mrn',
  'name',
  'address',
  'birthDate',
  'language',
  'ethnicity',
  'birthsex',
  'race',
  'telecom',
  'multipleBirth',
  'photo',
  'contact',
  'generalPractitioner',
  'managingOrganization',
  'link',
];

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
    // mask specified fields in the patient data
    if (typeof this.mask === 'string') {
      maskPatientData(bundle, ALL_SUPPORTED_MASK_FIELDS);
    } else if (this.mask.length > 0) maskPatientData(bundle, this.mask);
    return bundle;
  }
}

module.exports = {
  FHIRPatientExtractor,
};
