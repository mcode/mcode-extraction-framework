const _ = require('lodash');
const fhirpath = require('fhirpath');
const Ajv = require('ajv');
const metaSchema = require('ajv/lib/refs/json-schema-draft-06.json');
const schema = require('./schemas/fhir.schema.json');
const logger = require('./logger');

const ajv = new Ajv({ logger: false });
ajv.addMetaSchema(metaSchema);
const validator = ajv.addSchema(schema, 'FHIR');

// Unit codes and display values fo Vital Signs values
// Code mapping is based on http://hl7.org/fhir/R4/observation-vitalsigns.html
// and inferred from manually referencing display values of codes in
// value sets utilized by these Vital Signs
const quantityCodeToUnitLookup = {
  '/min': '/min',
  '%': '%',
  '[degF]': 'degF',
  '[in_i]': 'in',
  '[lb_av]': 'lb_av',
  'kg/m2': 'kg/m2',
  'mm[Hg]': 'mmHg',
  Cel: 'Cel',
  cm: 'cm',
  kg: 'kg',
  g: 'g',
};

function getResourceCountInBundle(messageBundle) {
  const allResourceTypesPath = 'Bundle.descendants().resource.resourceType';
  const allResourceTypes = fhirpath.evaluate(
    messageBundle,
    allResourceTypesPath,
  );

  // NOTE: Dynamically generated from input; could be abused later?
  const countThisResource = (resourceType) => `Bundle.descendants().where(resource.resourceType = '${resourceType}').count()`;
  return _.uniq(allResourceTypes).reduce((accumulator, resourceType) => {
    const countForThisResource = fhirpath.evaluate(
      messageBundle,
      countThisResource(resourceType),
    );
    accumulator[resourceType] = countForThisResource;
    return accumulator;
  }, {});
}


function getQuantityUnit(unitCode) {
  if (!Object.keys(quantityCodeToUnitLookup).includes(unitCode)) {
    logger.warn('No unit found for provided unit code. Using unit code as unit instead.');
    return unitCode;
  }
  return quantityCodeToUnitLookup[unitCode];
}

function isBundleEmpty(bundle) {
  return bundle.total === 0 || bundle.entry.length === 0;
}

function firstEntryInBundle(bundle) {
  return bundle.entry[0];
}

function firstResourceInBundle(searchSet) {
  return searchSet.entry[0].resource;
}

function allResourcesInBundle(bundle) {
  return bundle.entry.map((e) => e.resource);
}

function getEmptyBundle() {
  return {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [],
  };
}

function determineVersion(fhirBundle) {
  // TODO: Actual determination of versions
  if (fhirBundle) {
    return 'R4';
  }
  return 'R4';
}

function mapFHIRVersions(resource, currentVersion, targetVersion) {
  // TODO: Compare versions and map when needed of versions
  if (currentVersion === targetVersion) {
    return resource;
  }
  return resource;
}

function firstIdentifierEntry(resource) {
  if (resource.identifier && resource.identifier.length > 0) {
    return resource.identifier[0];
  }
  return null;
}

// Utility function to get the resources of a type from our bundle
// Optionally get only the first resource of that type via 'first' parameter
const getBundleResourcesByType = (bundle, type, context = {}, first = false) => {
  const resources = fhirpath.evaluate(
    bundle,
    `Bundle.entry.where(resource.resourceType='${type}').resource`,
    context,
  );

  if (resources.length > 0) {
    return first ? resources[0] : resources;
  }

  return first ? null : [];
};

const getBundleEntriesByResourceType = (bundle, type, context = {}, first = false) => {
  const resources = fhirpath.evaluate(
    bundle,
    `Bundle.entry.where(resource.resourceType='${type}')`,
    context,
  );

  if (resources.length > 0) {
    return first ? resources[0] : resources;
  }

  return first ? null : [];
};


const logOperationOutcomeInfo = (operationOutcome) => {
  logger.info('An OperationOutcome was returned with the following issue(s):');
  operationOutcome.issue.forEach((issue) => {
    let issueMessage = `Severity: ${issue.severity}. Code: ${issue.code}`;
    let detailsMessage = '';
    if (issue.diagnostics) issueMessage += `. Diagnostics: ${issue.diagnostics}`;
    if (issue.expression) issueMessage += `. Related FHIRPath: ${issue.expression}`;
    if (issue.details) {
      if (issue.details.text) issueMessage += `. Details: ${issue.details.text}`;
      if (issue.details.coding.length > 0) detailsMessage += 'Codings: ';
      issue.details.coding.forEach((coding) => {
        detailsMessage += `Code: ${coding.code}, System: ${coding.system}, Display: ${coding.display}. `;
      });
    }

    // Log with the same severity as the issue
    let logLevel = 'info'; // issue.severity === 'information'
    if (issue.severity === 'fatal' || issue.severity === 'error') {
      logLevel = 'error';
    } else if (issue.severity === 'warning') {
      logLevel = 'warn';
    }
    logger.log(logLevel, issueMessage);
    if (detailsMessage) {
      // If there were any codes, log them
      logger.debug(detailsMessage);
    }
  });
};

function isValidFHIR(resource) {
  return validator.validate('FHIR', resource);
}
function invalidResourcesFromBundle(bundle) {
  // Bundle is assumed to have all resources in bundle.entry[x].resource
  const failingResources = [];
  bundle.entry.forEach((e) => {
    const { resource } = e;
    const { id, resourceType } = resource;
    if (!validator.validate('FHIR', resource)) {
      const failureId = `${resourceType}-${id}`;
      failingResources.push(failureId);
    }
  });
  return failingResources;
}

module.exports = {
  allResourcesInBundle,
  determineVersion,
  firstEntryInBundle,
  firstIdentifierEntry,
  firstResourceInBundle,
  getBundleEntriesByResourceType,
  getBundleResourcesByType,
  getEmptyBundle,
  getQuantityUnit,
  getResourceCountInBundle,
  isBundleEmpty,
  logOperationOutcomeInfo,
  mapFHIRVersions,
  quantityCodeToUnitLookup,
  isValidFHIR,
  invalidResourcesFromBundle,
};
