const { FHIRClient } = require('fhir-crud-client');
const logger = require('../helpers/logger');

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
    return this.client.search({ resourceType, params });
  }
}

module.exports = {
  BaseFHIRModule,
};
