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

module.exports = {
  stringNormalizer,
  normalizeEmptyValues,
};
