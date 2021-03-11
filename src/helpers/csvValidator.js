const _ = require('lodash');
const fs = require('fs');
const validate = require('csv-file-validator');
const parse = require('csv-parse/lib/sync');
const logger = require('./logger');

async function validateCSV(pathToCSVFile, csvSchema) {
  const csv = fs.readFileSync(pathToCSVFile, { columns: true, encoding: 'utf8' });

  // Use CSV parser to determine actual number of columns in file
  const csvJson = parse(csv);

  if (csvJson[0].length !== csvSchema.headers.length) {
    // Report which erroneous columns exist in provided CSV
    const difference = _.difference(csvJson[0], csvSchema.headers.map((h) => h.name));

    logger.error(`Validation error in CSV ${pathToCSVFile}: found extra column(s) "${difference}"`);
    process.exit(1);
  }

  try {
    const { inValidMessages } = await validate(csv, csvSchema);

    if (inValidMessages.length > 0) {
      inValidMessages.forEach((errorMsg) => {
        logger.error(`Validation error in CSV ${pathToCSVFile}: ${errorMsg}`);
      });

      process.exit(1);
    }
  } catch (e) {
    logger.error(`Error occurred during CSV validation: ${e.message}`);
    process.exit(1);
  }
}

module.exports = {
  validateCSV,
};
