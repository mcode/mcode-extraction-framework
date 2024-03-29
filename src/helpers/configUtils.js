const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const metaSchema = require('ajv/lib/refs/json-schema-draft-06.json');
const logger = require('./logger');
const configSchema = require('./schemas/config.schema.json');

function getConfig(pathToConfig) {
  // Checks pathToConfig points to valid JSON file
  const fullPath = path.resolve(pathToConfig);
  try {
    return JSON.parse(fs.readFileSync(fullPath));
  } catch (err) {
    throw new Error(`The provided filepath to a configuration file ${pathToConfig}, full path ${fullPath} did not point to a valid JSON file.`);
  }
}

const ajv = new Ajv({ logger: false, allErrors: true });
ajv.addMetaSchema(metaSchema);

ajv.addFormat('comma-separated-emails', {
  type: 'string',
  validate: (emails) => {
    // this is Ajv's regex for email format (https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts#L106)
    const emailRegex = new RegExp(/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i);
    return emails.split(',').every((email) => emailRegex.test(email.trim()));
  },
});
ajv.addFormat('email-with-name', {
  type: 'string',
  validate: (email) => {
    // this is Ajv's regex for email format (https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts#L106)
    const emailRegex = new RegExp(/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i);
    return emailRegex.test(email.trim().split(' ').pop());
  },
});
ajv.addFormat('mask-all', {
  type: 'string',
  validate: (string) => string === 'all',
});

const validator = ajv.addSchema(configSchema, 'config');

function validateConfig(config) {
  logger.debug('Validating config file');
  const valid = validator.validate('config', config);
  const errors = ajv.errorsText(validator.errors, { dataVar: 'config' });
  if (!valid) throw new Error(`Error(s) found in config file: ${errors}`);
  logger.debug('Config file validated successfully');
}

module.exports = {
  getConfig,
  validateConfig,
};
