const path = require('path');
const moment = require('moment');
const fs = require('fs');
const logger = require('../../helpers/logger');

// Sort Log records by `dateRun`, more recent (larger) dates to least recent (smaller)
function logSorter(a, b) {
  return moment(b.dateRun) - moment(a.dateRun);
}

// Common wrapper function for checking if a value is a date
function isDate(date) {
  return moment(date).isValid();
}

// Create a new instance of a Log record based on a `to` and `from` date
function createLogObject(fromDate, toDate) {
  const now = moment();
  return {
    dateRun: now,
    toDate: toDate || now,
    fromDate,
  };
}

// Provides an interface for loading existing logs of client RunInstances,
// getting the most recent runs, and returning the most recent run
class RunInstanceLogger {
  constructor(pathToLogFile) {
    this.logPath = pathToLogFile;
    if (path.resolve(this.logPath) === path.resolve(path.join('logs', 'run-logs.json')) && !fs.existsSync(this.logPath)) {
      logger.info(`No log file found. Creating default log file at ${this.logPath}`);
      if (!fs.existsSync('logs')) fs.mkdirSync('logs');
      fs.appendFileSync(this.logPath, '[]');
    }
    // Check that the given log file exists
    try {
      this.logs = JSON.parse(fs.readFileSync(this.logPath));
      if (!Array.isArray(this.logs)) throw new Error('Log file needs to be an array.');
    } catch (err) {
      logger.error(`The provided filepath to a LogFile, ${this.logPath}, did not point to a valid JSON file. Create a json file with an empty array at this location.`);
      throw new Error(err.message);
    }
    // Sort logs on load
    this.logs.sort(logSorter);
  }

  // Use previous runs to infer a valid fromDate if none was provided
  getEffectiveFromDate(fromDate) {
    if (fromDate) return fromDate;

    // Use the most recent ToDate
    logger.info('No fromDate was provided, inferring an effectiveFromDate');
    const effectiveFromDate = this.getMostRecentToDate();
    logger.info(`effectiveFromDate: ${effectiveFromDate}`);
    if (!effectiveFromDate) {
      throw new Error('no valid fromDate was supplied, and there are no log records from which we could pull a fromDate');
    }

    return effectiveFromDate;
  }

  // Get the most recent run performed and logged
  getMostRecentToDate() {
    // Filter logs by client
    const filteredLogs = this.logs.filter((l) => l.client === this.client);
    // Sorting of logs is maintained over load and update; this should be safe
    return filteredLogs[0] && filteredLogs[0].toDate;
  }

  // Calling this adds a new Log record to our local object and to the file on disk
  addRun(fromDate, toDate) {
    logger.info('Logging successful run information to records');
    // If fromDate isn't valid, or if toDate is both defined and invalid, we can't properly log
    if (!isDate(fromDate) || (toDate && !isDate(toDate))) {
      logger.error(`Trying to add a run to RunInstance logger, but toDate and fromDate are not valid dates: to ${toDate} and from ${fromDate}`);
      logger.error('Log failed');
      return;
    }
    const log = createLogObject(fromDate, toDate);
    this.logs.push(log);
    this.logs.sort(logSorter);
    fs.writeFileSync(this.logPath, JSON.stringify(this.logs));
  }
}

module.exports = {
  RunInstanceLogger,
};
