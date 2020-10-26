const { FHIRClient } = require('fhir-crud-client');
const logger = require('../helpers/logger');
const { getBundleResourcesByType, logOperationOutcomeInfo } = require('../helpers/fhirUtils');

class BaseFHIRModule {
  constructor(baseUrl, requestHeaders) {
    this.baseUrl = baseUrl;
    this.client = new FHIRClient(this.baseUrl, requestHeaders);
  }

  updateRequestHeaders(newHeaders) {
    this.client.updateRequestHeaders(newHeaders);
  }

  async search(resourceType, params) {
    logger.debug(`GET ${this.baseUrl}/${resourceType}`);
    const result = await this.client.search({ resourceType, params });
    const operationOutcomeEntry = getBundleResourcesByType(result, 'OperationOutcome', {}, true);
    if (operationOutcomeEntry) {
      logOperationOutcomeInfo(operationOutcomeEntry);
    }
    return result;
  }
}

module.exports = {
  BaseFHIRModule,
};
