const moment = require('moment');
const logger = require('../helpers/logger');
const { RunInstanceLogger } = require('./tools/RunInstanceLogger');
const { sendEmailNotification, zipErrors } = require('./tools/emailNotifications');
const { extractDataForPatients } = require('./tools/mcodeExtraction');
const { parsePatientIds } = require('../helpers/appUtils');
const { validateConfig } = require('../helpers/configUtils');

function checkInputAndConfig(config, fromDate, toDate) {
  // Check input args and needed config variables based on client being used
  validateConfig(config);

  // Check if `fromDate` is a valid date
  if (fromDate && !moment(fromDate).isValid()) {
    throw new Error('-f/--from-date is not a valid date.');
  }

  // Check if `toDate` is a valid date
  if (toDate && !moment(toDate).isValid()) {
    throw new Error('-t/--to-date is not a valid date.');
  }
}

async function mcodeApp(Client, fromDate, toDate, config, pathToRunLogs, debug, allEntries) {
  logger.level = debug ? 'debug' : 'info';
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
  if (notificationInfo && Object.keys(notificationInfo).length > 0) {
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

  return extractedData;
}

module.exports = {
  mcodeApp,
};
