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

function determineVersion(fhirBundle) {
  // TODO: Actual determination of versions
  if (fhirBundle) {
    return 'DSTU2';
  }
  return 'DSTU2';
}

function mapFHIRVersions(resource, currentVersion, targetVersion) {
  // TODO: Compare versions and map when needed of versions
  if (currentVersion === targetVersion) {
    return resource;
  }
  return resource;
}

module.exports = {
  isBundleEmpty,
  firstEntryInBundle,
  firstResourceInBundle,
  allResourcesInBundle,
  determineVersion,
  mapFHIRVersions,
};
