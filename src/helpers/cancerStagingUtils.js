const cancerStagingSystemVS = require('../valueSets/ValueSet-mcode-cancer-staging-system-vs.json');

function checkCodeInVS(code, valueSet) {
  return valueSet.compose.include[0].concept.map((c) => c.code).includes(code);
}

function isCancerStagingSystem(code) {
  return checkCodeInVS(code, cancerStagingSystemVS);
}

module.exports = {
  isCancerStagingSystem,
};
