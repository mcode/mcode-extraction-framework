const fs = require('fs');
const path = require('path');
const moment = require('moment');
const logger = require('../helpers/logger');
const { RunInstanceLogger } = require('./tools/RunInstanceLogger');
const { sendEmailNotification, zipErrors } = require('./tools/emailNotifications');
const { extractDataForPatients } = require('./tools/mcodeExtraction');
const { maskMRN } = require('../helpers/patientUtils');
const { parsePatientIds } = require('../helpers/appUtils');

function getConfig(pathToConfig) {
  // Checks pathToConfig points to valid JSON file
  const fullPath = path.resolve(pathToConfig);
  try {
    return JSON.parse(fs.readFileSync(fullPath));
  } catch (err) {
    throw new Error(`The provided filepath to a configuration file ${pathToConfig}, full path ${fullPath} did not point to a valid JSON file.`);
  }
}

function checkInputAndConfig(config, fromDate, toDate) {
  // Check input args and needed config variables based on client being used
  const { patientIdCsvPath } = config;

  // Check if `fromDate` is a valid date
  if (fromDate && !moment(fromDate).isValid()) {
    throw new Error('-f/--from-date is not a valid date.');
  }

  // Check if `toDate` is a valid date
  if (toDate && !moment(toDate).isValid()) {
    throw new Error('-t/--to-date is not a valid date.');
  }

  // Check if there is a path to the MRN CSV within our config JSON
  if (!patientIdCsvPath) {
    throw new Error('patientIdCsvPath is required in config file');
  }
}

async function mcodeApp(Client, fromDate, toDate, pathToConfig, pathToRunLogs, debug, allEntries) {
  logger.level = debug ? 'debug' : 'info';
  const config = getConfig(pathToConfig);
  checkInputAndConfig(config, fromDate, toDate);

  // Create and initialize client
  const mcodeClient = new Client(config);
  await mcodeClient.init();

  // Parse CSV for list of patient mrns
  const patientIds = parsePatientIds(config.patientIdCsvPath);

  // Get RunInstanceLogger for recording new runs and inferring dates from previous runs
  const runLogger = allEntries ? null : new RunInstanceLogger(pathToRunLogs);
  const effectiveFromDate = allEntries ? null : runLogger.getEffectiveFromDate(fromDate);
  const effectiveToDate = allEntries ? null : toDate;

  // Extract the data
  logger.info(`Extracting data for ${patientIds.length} patients`);
  const { extractedData, successfulExtraction, totalExtractionErrors } = await extractDataForPatients(patientIds, mcodeClient, effectiveFromDate, effectiveToDate);

  // If we have notification information, send an emailNotification
  const { notificationInfo } = config;
  if (notificationInfo) {
    const notificationErrors = zipErrors(totalExtractionErrors);
    try {
      await sendEmailNotification(notificationInfo, notificationErrors, debug);
    } catch (e) {
      logger.error(e.message);
    }
  }
  // A run is successful and should be logged when both extraction finishes without fatal errors
  // and messages are posted without fatal errors
  if (!allEntries && effectiveFromDate) {
    const successCondition = successfulExtraction;
    if (successCondition) {
      runLogger.addRun(effectiveFromDate, effectiveToDate);
    }
  }

  // check if config specifies that MRN needs to be masked
  // if it does need to be masked, mask all references to MRN outside of the patient resource
  const patientConfig = config.extractors.find((e) => e.type === 'CSVPatientExtractor');
  if (patientConfig && ('constructorArgs' in patientConfig && 'mask' in patientConfig.constructorArgs)) {
    if (patientConfig.constructorArgs.mask.includes('mrn')) {
      extractedData.forEach((bundle, i) => {
        // NOTE: This may fail to mask MRN-related properties on non-patient resources
        //       Need to investigate further.
        try {
          maskMRN(bundle);
        } catch (e) {
          logger.error(`Bundle ${i + 1}: ${e.message}`);
        }
      });
    }
  }

  return extractedData;
}

module.exports = {
  mcodeApp,
};
