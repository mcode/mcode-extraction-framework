const parse = require('csv-parse/lib/sync');
const logger = require('./logger');

// The standard string normalizer function
function stringNormalizer(str) {
  return str.toLowerCase();
}

// For translating null/nil-like values into empty strings
function normalizeEmptyValues(data, unalterableColumns = []) {
  logger.debug('Checking for empty CSV values to normalize');
  const EMPTY_VALUES = ['null', 'nil'].map(stringNormalizer);
  const normalizedUnalterableColumns = unalterableColumns.map(stringNormalizer);
  // Flag tracking if empty values were normalized or not.
  let wasEmptyNormalized = false;
  const newData = data.map((row, i) => {
    const newRow = { ...row };
    // Filter out unalterable columns
    const columnsToNormalize = Object.keys(row).filter(
      (col) => !normalizedUnalterableColumns.includes(stringNormalizer(col)),
    );
    columnsToNormalize.forEach((col) => {
      const value = newRow[col];
      // If the value for this row-col combo is a value that should be empty, replace it
      if (EMPTY_VALUES.includes(stringNormalizer(value))) {
        logger.debug(
          `NULL/NIL values '${value}' found in row-${i}, col-${col}`,
        );
        wasEmptyNormalized = true;
        newRow[col] = '';
      }
    });
    return newRow;
  });

  if (wasEmptyNormalized) {
    logger.warn('NULL/NIL values found and replaced with empty-strings');
  }
  return newData;
}

// Default options for CSV parsing
const DEFAULT_OPTIONS = {
  columns: (header) => header.map((column) => stringNormalizer(column)),
  // https://csv.js.org/parse/options/bom/
  bom: true,
  // https://csv.js.org/parse/options/skip_empty_lines/
  skip_empty_lines: true,
  // NOTE: This will skip any records with empty values, not just skip the empty values themselves
  // NOTE-2: The name of the flag changed from v4 (what we use) to v5 (what is documented)
  // https://csv.js.org/parse/options/skip_records_with_empty_values/
  skip_lines_with_empty_values: true,
};

// Common utility for parsing CSV files
function csvParse(csvData, options = {}) {
  return parse(csvData, { ...DEFAULT_OPTIONS, ...options });
}


module.exports = {
  stringNormalizer,
  normalizeEmptyValues,
  csvParse,
};
