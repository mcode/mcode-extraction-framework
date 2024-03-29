const logger = require('./logger');

/**
 * Checks if any dependencies of extractors are missing.
 * If no depedencies are missing, sorts extractors into the correct order.
 * @param {Array} extractors array of extractors from the config file
 * @param {Array} dependencyInfo array of objects dictacting order of extractors and their dependencies
 * @returns {Array} array of extractors sorted into the order defined in dependency info
 * Example of dependencyInfo:
 * [
 *  { type: 'CSVPatientExtractor', dependencies: [] },
 *  { type: 'CSVConditionExtractor', dependencies: ['CSVPatientExtractor'] },
 *  ...
 * ]
 */
function sortExtractors(extractors, dependencyInfo) {
  const missing = {};
  // Filter dependency info to only extractors in the config
  dependencyInfo.filter((e) => extractors.map((x) => x.type).includes(e.type)).forEach((extractor) => {
    // For each extractor, check if its dependencies are present
    extractor.dependencies.forEach((dependency) => {
      if (extractors.filter((e) => e.type === dependency).length === 0) {
        if (missing[dependency] === undefined) {
          missing[dependency] = [extractor.type];
        } else {
          missing[dependency].push(extractor.type);
        }
      }
    });
  });
  // If extractors are missing, alert user which are missing
  if (Object.keys(missing).length > 0) {
    Object.keys(missing).forEach((extractor) => {
      logger.error(`Missing dependency: ${extractor} (required by: ${missing[extractor].join(', ')})`);
    });
    throw new Error('Some extractors are missing dependencies, see above for details.');
  }
  // If no missing dependencies, sort extractors into correct order
  const sortedExtractors = [...extractors];
  const order = dependencyInfo.map((x) => x.type);
  sortedExtractors.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
  return sortedExtractors;
}

module.exports = {
  sortExtractors,
};
