const fhirpath = require('fhirpath');

function isBundleEmpty(bundle) {
  return bundle.total === 0;
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
const getBundleResourcesByType = (bundle, type, context = {}, first) => {
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

module.exports = {
  allResourcesInBundle,
  determineVersion,
  firstEntryInBundle,
  firstResourceInBundle,
  getBundleResourcesByType,
  getEmptyBundle,
  isBundleEmpty,
  mapFHIRVersions,
};
