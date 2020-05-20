const { FHIRClient } = require('fhir-crud-client');
const logger = require('../helpers/logger');

class BaseFHIRModule {
  constructor(baseUrl, requestHeaders) {
    this.baseUrl = baseUrl;
    // All the request headers for our request
    this.client = new FHIRClient(this.baseUrl, requestHeaders);
  }

  updateRequestHeaders(newHeaders) {
    this.client.updateRequestHeaders(newHeaders);
  }

  async search(resourceType, params) {
    logger.info(`GET ${this.baseUrl}/${resourceType}`);
    return this.client.search({ resourceType, params });
  }
}

module.exports = {
  BaseFHIRModule,
};
