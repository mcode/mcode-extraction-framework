const { BaseClient } = require('./BaseClient');
const { allExtractors, dependencyInfo } = require('../extractors');
const { sortExtractors } = require('../helpers/dependencyUtils.js');

class MCODEClient extends BaseClient {
  constructor({ extractors, commonExtractorArgs, webServiceAuthConfig }) {
    super();
    this.registerExtractors(...allExtractors);
    // Store the extractors defined by the configuration file as local state
    this.extractorConfig = extractors;
    // Sort extractors based on order and dependencies
    this.extractorConfig = sortExtractors(this.extractorConfig, dependencyInfo);
    // Store webServiceAuthConfig if provided`
    this.authConfig = webServiceAuthConfig;
    this.commonExtractorArgs = {
      implementation: 'mcode',
      ...commonExtractorArgs,
    };
  }
}
module.exports = {
  MCODEClient,
};
