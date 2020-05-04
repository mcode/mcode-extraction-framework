const { Extractor } = require('./Extractor');
const { BaseFHIRModule } = require('../modules');
const { determineVersion, mapFHIRVersions, isBundleEmpty } = require('../helpers/fhirUtils');
const logger = require('../helpers/logger');

class BaseFHIRExtractor extends Extractor {
  constructor(baseFhirUrl, requestHeaders, version) {
    super();
    this.baseFHIRModule = new BaseFHIRModule(baseFhirUrl, requestHeaders);
    this.version = version;
  }

  updateRequestHeaders(newHeaders) {
    this.baseFHIRModule.updateRequestHeaders(newHeaders);
  }

  async get(resourceType, params) {
    // Since this extractor gets data from FHIR endpoints, we don't
    // need the typical 1. Get; 2. Reformat&join; 3. Populate template
    // 1. Get data
    logger.info(`Getting ${resourceType} FHIR resource`);
    const fhirResponseBundle = await this.baseFHIRModule.search(resourceType, params);
    if (isBundleEmpty(fhirResponseBundle)) {
      logger.warn(`${resourceType} bundle that was supposed to have entries had 0`);
      return fhirResponseBundle;
    }
    logger.info(`Found ${fhirResponseBundle.entry.length} ${resourceType} FHIR resources in BaseFHIRExtractor get`);
    // 2. Reformat versions where necessary;
    const resVersion = determineVersion(fhirResponseBundle);
    if (resVersion !== this.version) {
      logger.info(`Mapping ${resourceType} FHIR responses from ${resVersion} to ${this.version}`);
      fhirResponseBundle.entry = fhirResponseBundle.entry.map((resource) => mapFHIRVersions(resource, resVersion, this.version));
      return fhirResponseBundle;
    }
    // If versions match, no mapping necessary
    return fhirResponseBundle;
  }
}

module.exports = {
  BaseFHIRExtractor,
};
