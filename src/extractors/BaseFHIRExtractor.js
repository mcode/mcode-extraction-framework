const { Extractor } = require('./Extractor');
const { BaseFHIRModule } = require('../modules');
const { determineVersion, mapFHIRVersions, isBundleEmpty } = require('../helpers/fhirUtils');
const { getPatientFromContext } = require('../helpers/contextUtils');
const logger = require('../helpers/logger');

class BaseFHIRExtractor extends Extractor {
  constructor({ baseFhirUrl, requestHeaders, version, resourceType }) {
    super();
    this.resourceType = resourceType;
    this.version = version;
    this.baseFHIRModule = new BaseFHIRModule(baseFhirUrl, requestHeaders);
  }

  updateRequestHeaders(newHeaders) {
    this.baseFHIRModule.updateRequestHeaders(newHeaders);
  }

  /* eslint-disable class-methods-use-this */
  // Use context to get PatientId by default; common need across almost all extractors
  // NOTE: Async because other extractors that extend this may need to make async lookups in the future
  async parametrizeArgsForFHIRModule({ mrn, context }) {
    const patient = getPatientFromContext(mrn, context);
    return { patient: patient.id };
  }
  /* eslint-enable class-methods-use-this */

  // Since different superclasses of the baseFHIRExtractor will parse the `get`
  // arguments differently, all pass to this function which interfaces with the baseFHIRModule
  async getWithFHIRParams(params) {
    // 1. Get data
    logger.debug(`Getting ${this.resourceType} FHIR resource`);
    const fhirResponseBundle = await this.baseFHIRModule.search(this.resourceType, params);
    if (isBundleEmpty(fhirResponseBundle)) {
      logger.warn(`${this.resourceType} bundle that was supposed to have entries had 0`);
      return fhirResponseBundle;
    }
    logger.debug(`Found ${fhirResponseBundle.entry.length} ${this.resourceType} FHIR resources in get`);

    // 2. Reformat versions where necessary;
    const resVersion = determineVersion(fhirResponseBundle);
    if (this.version && resVersion !== this.version) {
      logger.debug(`Mapping ${this.resourceType} FHIR responses from ${resVersion} to ${this.version}`);
      fhirResponseBundle.entry = fhirResponseBundle.entry.map((resource) => mapFHIRVersions(resource, resVersion, this.version));
      return fhirResponseBundle;
    }

    // 3. If versions match, no mapping necessary
    return fhirResponseBundle;
  }

  async get(argumentObject) {
    // Need to translate MRN to FHIR params
    const params = await this.parametrizeArgsForFHIRModule(argumentObject);
    const searchSetBundle = await this.getWithFHIRParams(params);
    return {
      resourceType: 'Bundle',
      type: 'collection',
      entry: (searchSetBundle.total === 0) ? [] : searchSetBundle.entry,
    };
  }
}

module.exports = {
  BaseFHIRExtractor,
};
