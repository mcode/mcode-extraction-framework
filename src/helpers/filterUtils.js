const fhirpath = require('fhirpath');

function postExtractionFilter(extractedData, filter) {
  extractedData.map((bundle) => {
    const filteredBundle = bundle;
    filteredBundle.entry = fhirpath.evaluate(
      bundle,
      `Bundle.entry.where(${filter})`,
    );
    return filteredBundle;
  });
}

module.exports = {
  postExtractionFilter,
};
