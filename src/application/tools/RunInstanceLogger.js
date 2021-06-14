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
    try {
      this.logs = JSON.parse(fs.readFileSync(path.resolve(this.logPath)));
      // Sort logs on load
      this.logs.sort(logSorter);
    } catch (err) {
      logger.error(`FATAL-Could not parse the logPath provided: ${this.logPath}`);
      process.exit(1);
    }
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
