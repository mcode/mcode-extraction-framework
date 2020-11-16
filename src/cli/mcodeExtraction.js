const logger = require('../helpers/logger');
const { getResourceCountInBundle } = require('../helpers/fhirUtils');

async function extractDataForPatients(patientIds, mcodeClient, fromDate, toDate) {
  // Using an initialized mcodeClient, extract data for patient ids in the appropriate toDate-fromDate range
  const totalExtractionErrors = {};
  const extractedData = [];
  // Track if these runs were successful; if not, don't log a new RunInstance
  let successfulExtraction = true;
  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */
  for (const [index, mrn] of patientIds.entries()) {
    totalExtractionErrors[index] = [];
    try {
      logger.info(`Extracting information for patient at row ${index + 1} in .csv file`);
      const { bundle, extractionErrors } = await mcodeClient.get({ mrn, fromDate, toDate });
      totalExtractionErrors[index].push(...extractionErrors);
      const resourceCount = getResourceCountInBundle(bundle);
      logger.info(`Resources extracted for patient ${index + 1} in .csv file`);
      Object.keys(resourceCount).forEach((resourceType) => logger.info(`${resourceType}: ${resourceCount[resourceType]} extracted`));
      extractedData.push(bundle);
    } catch (fatalErr) {
      successfulExtraction = false;
      totalExtractionErrors[index].push(fatalErr);
      logger.error(`Fatal error extracting data: ${fatalErr.message}`);
      logger.debug(fatalErr.stack);
    }
  }
  return { extractedData, successfulExtraction, totalExtractionErrors };
}

module.exports = {
  extractDataForPatients,
};
