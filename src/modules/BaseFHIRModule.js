const { FHIRClient } = require('fhir-crud-client');
const logger = require('../helpers/logger');

class BaseFHIRModule {
  constructor(baseUrl, requestHeaders, authConfig) {
    this.baseUrl = baseUrl;
    this.authConfig = authConfig;
    // All the request headers for our request
    this.requestHeaders = requestHeaders;
    this.client = new FHIRClient(this.baseUrl, this.requestHeaders);
  }

  updateRequestHeaders(newHeaders) {
    this.requestHeaders = newHeaders;
    this.client.updateRequestHeaders(this.requestHeaders);
  }

  async search(resourceType, params) {
    logger.info(`GET ${this.baseUrl}/${resourceType}`);
    return this.client.search({ resourceType, params });
  }
}

module.exports = {
  BaseFHIRModule,
};
