const fhirpath = require('fhirpath');
const logger = require('./logger');

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
  logger.warn('An OperationOutcome was returned with the following issue(s):');
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

module.exports = {
  getQuantityUnit,
  quantityCodeToUnitLookup,
  allResourcesInBundle,
  determineVersion,
  firstEntryInBundle,
  firstResourceInBundle,
  getBundleEntriesByResourceType,
  getBundleResourcesByType,
  getEmptyBundle,
  isBundleEmpty,
  logOperationOutcomeInfo,
  mapFHIRVersions,
};
