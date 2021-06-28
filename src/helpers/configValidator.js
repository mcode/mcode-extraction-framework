const Ajv = require('ajv');
const metaSchema = require('ajv/lib/refs/json-schema-draft-06.json');
const logger = require('./logger');
const configSchema = require('./schemas/config.schema.json');

const ajv = new Ajv({ logger: false, allErrors: true });
ajv.addMetaSchema(metaSchema);
const validator = ajv.addSchema(configSchema, 'config');

function validateConfig(config) {
  logger.debug('Validating config file');
  const valid = validator.validate('config', config);
  const errors = ajv.errorsText(validator.errors, { dataVar: 'config' });
  if (!valid) throw new Error(`Error(s) found in config file: ${errors}`);
  logger.debug('Config file validated successfully');
}

module.exports = {
  validateConfig,
};
