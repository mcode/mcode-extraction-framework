const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const vsTypes = {
  json: 1,
  xml: 2,
  turtle: 3,
};

function loadJsonVS(filepath) {
  try {
    const vsData = fs.readFileSync(path.resolve(__dirname, filepath));
    const vsJson = JSON.parse(vsData);
    return vsJson;
  } catch (error) {
    logger.error(`Could not load valueSet from path ${filepath}`);
    throw error;
  }
}

function loadVS(filepath, typeOfVS = vsTypes.json) {
  switch (typeOfVS) {
    case vsTypes.json:
      logger.info(`loading JSON valueset from ${filepath}`);
      return loadJsonVS(filepath);

    case vsTypes.xml:
      logger.error('No defined valueset loader for `xml` type valuesets');
      return null;

    case vsTypes.turtle:
      logger.error('No defined valueset loader for `turtle` type valuesets');
      return null;

    default:
      logger.error(`'${typeOfVS}' is not a recognized valueset type`);
      return null;
  }
}

/**
 * Check if code is in value set
 * @param {object} code value to look for in a valueset
 * @param {object} valueSet contains list of codes included in value set
 * @return {boolean} true if condition is in valueSet's compose block or expansion block
 */
const checkCodeInVS = (code, valueSetFilePath, typeOfVS = vsTypes.json) => {
  const valueSet = loadVS(valueSetFilePath, typeOfVS);
  let inVSExpansion = false;
  let inVSCompose = false;
  if (valueSet.expansion) {
    // If valueSet has expansion, we only need to check these codes since everything in compose is in expansion
    inVSExpansion = valueSet.expansion.contains.some((containsItem) => {
      if (!code || !containsItem) return false;
      // return code.system === containsItem.system && code === containsItem.code;
      return code === containsItem.code;
    });
  } else {
    // Checks if code is in any of the valueSet.compose.include arrays
    inVSCompose = valueSet.compose.include.some((includeItem) => {
      if (!code || !includeItem || !includeItem.concept) return false;
      // return c.system === includeItem.system && includeItem.concept.map((concept) => concept.code).includes(code);
      return includeItem.concept.map((concept) => concept.code).includes(code);
    });
  }
  return inVSCompose || inVSExpansion;
};

module.exports = {
  vsTypes,
  loadJsonVS,
  loadVS,
  checkCodeInVS,
};
