const fs = require('fs');
const logger = require('./logger');

const vsTypes = {
  json: 1,
  xml: 2,
  turtle: 3,
};

function loadJsonVs(absoluteFilepath) {
  try {
    const vsData = fs.readFileSync(absoluteFilepath);
    const vsJson = JSON.parse(vsData);
    return vsJson;
  } catch (error) {
    logger.error(`Could not load valueSet from path ${absoluteFilepath}`);
    throw error;
  }
}

function loadVs(absoluteFilepath, typeOfVS) {
  switch (typeOfVS) {
    case vsTypes.json:
      logger.debug(`loading JSON valueset from ${absoluteFilepath}`);
      return loadJsonVs(absoluteFilepath);

    case vsTypes.xml:
      throw Error('No defined valueset loader for `xml` type valuesets');

    case vsTypes.turtle:
      throw Error('No defined valueset loader for `turtle` type valuesets');

    default:
      throw Error(`'${typeOfVS}' is not a recognized valueset type`);
  }
}

function getConceptFromVSExpansion(valueSet, code, codeSystem) {
  if (!code || !codeSystem || !valueSet) return undefined;
  return valueSet.expansion.contains.find((containsItem) => containsItem
      && containsItem.system
      && code === containsItem.code
      && codeSystem === containsItem.system);
}

function getConceptFromVSCompose(valueSet, code, codeSystem) {
  if (!code || !codeSystem || !valueSet) return undefined;
  const includeItem = valueSet.compose.include.find((item) => item
      && item.system
      && item.system === codeSystem
      && item.concept);
  if (!includeItem) return undefined;
  return includeItem.concept.find((concept) => concept.code === code);
}

function getDisplayFromConcept(pathToValueSet, code, codeSystem) {
  if (!code || !codeSystem || !pathToValueSet) return undefined;
  const valueSet = loadVs(pathToValueSet, vsTypes.json);
  let concept;
  if (valueSet.expansion) {
    // If valueSet has expansion, we only need to check these codes
    concept = getConceptFromVSExpansion(valueSet, code, codeSystem);
    return (concept && concept.display) ? concept.display : undefined;
  }
  concept = getConceptFromVSCompose(valueSet, code, codeSystem);
  return (concept && concept.display) ? concept.display : undefined;
}

/**
 * Check if code is in value set
 * @param {string} code value to look for in a valueset
 * @param {string} codeSystem the system to which the code value belongs
 * @param {string} valueSetFilePath the file path of the value set to be searched
 * @param {string} typeOfVS the file type of the value set to be searched
 * @return {boolean} true if condition is in valueSet's compose block or expansion block
 */
const checkCodeInVs = (
  code,
  codeSystem,
  valueSetFilePath,
  typeOfVS = vsTypes.json,
) => {
  const valueSet = loadVs(valueSetFilePath, typeOfVS);
  let inVSExpansion = false;
  let inVSCompose = false;
  if (valueSet.expansion) {
    // If valueSet has expansion, we only need to check these codes
    inVSExpansion = (getConceptFromVSExpansion(valueSet, code, codeSystem) !== undefined);
  } else {
    // Checks if code is in any of the valueSet.compose.include arrays
    inVSCompose = (getConceptFromVSCompose(valueSet, code, codeSystem) !== undefined);
  }
  return inVSCompose || inVSExpansion;
};

module.exports = {
  vsTypes,
  loadJsonVs,
  loadVs,
  checkCodeInVs,
  getDisplayFromConcept,
  getConceptFromVSCompose,
  getConceptFromVSExpansion,
};
