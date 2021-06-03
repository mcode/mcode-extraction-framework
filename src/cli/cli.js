const fs = require('fs');
const path = require('path');
const program = require('commander');
const { MCODEClient } = require('../client/MCODEClient');
const logger = require('../helpers/logger');
const { mcodeApp } = require('./app');

const defaultPathToConfig = path.join('config', 'csv.config.json');
const defaultPathToRunLogs = path.join('logs', 'run-logs.json');

program
  .usage('[options]')
  .option('-f --from-date <date>', 'The earliest date and time to search')
  .option('-t --to-date <date>', 'The latest date and time to search')
  .option('-e, --entries-filter', 'Flag to indicate to filter data by date')
  .option('-c --config-filepath <path>', 'Specify relative path to config to use:', defaultPathToConfig)
  .option('-r --run-log-filepath <path>', 'Specify relative path to log file of previous runs:', defaultPathToRunLogs)
  .option('-d, --debug', 'output extra debugging information')
  .parse(process.argv);

const {
  fromDate, toDate, configFilepath, runLogFilepath, debug, entriesFilter,
} = program;

// Flag to extract allEntries, or just to use to-from dates
const allEntries = !entriesFilter;

async function runApp() {
  try {
    extractedData = await mcodeApp(MCODEClient, fromDate, toDate, configFilepath, runLogFilepath, debug, allEntries);


    // Finally, save the data to disk
    const outputPath = './output';
    if (!fs.existsSync(outputPath)) {
      logger.info(`Creating directory ${outputPath}`);
      fs.mkdirSync(outputPath);
    }
    // For each bundle in our extractedData, write it to our output directory
    extractedData.forEach((bundle, i) => {
      const outputFile = path.join(outputPath, `mcode-extraction-patient-${i + 1}.json`);
      logger.debug(`Logging mCODE output to ${outputFile}`);
      fs.writeFileSync(outputFile, JSON.stringify(bundle), 'utf8');
    });
    logger.info(`Successfully logged ${extractedData.length} mCODE bundle(s) to ${outputPath}`);

    } catch (e) {
    if (debug) logger.level = 'debug';
    logger.error(e.message);
    logger.debug(e.stack);
    process.exit(1);
  }
}

runApp();
