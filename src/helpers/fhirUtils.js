const fhirpath = require('fhirpath');
const { invertObject } = require('./helperUtils');

// Unit codes and display values fo Vital Signs values
// Code mapping is based on http://hl7.org/fhir/R4/observation-vitalsigns.html
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

const quantityTextToCodeLookup = invertObject(quantityCodeToUnitLookup);

function getQuantityUnit(unitCode) {
  if (!Object.keys(quantityCodeToUnitLookup).includes(unitCode)) {
    return null;
  }
  return quantityCodeToUnitLookup[unitCode];
}

function getQuantityCode(unitText) {
  return quantityTextToCodeLookup[unitText];
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

module.exports = {
  getQuantityUnit,
  getQuantityCode,
  quantityCodeToUnitLookup,
  quantityTextToCodeLookup,
  allResourcesInBundle,
  determineVersion,
  firstEntryInBundle,
  firstResourceInBundle,
  getBundleEntriesByResourceType,
  getBundleResourcesByType,
  getEmptyBundle,
  isBundleEmpty,
  mapFHIRVersions,
};
